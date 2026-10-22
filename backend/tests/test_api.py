from io import BytesIO

from app import create_app
from app.config import normalize_database_url
from app.extensions import db
from app.models import Project
from app.routes.contact import recent_submissions
from app.services.persistence import prepare_production_database
from app.services.storage import is_safe_storage_key
from werkzeug.security import generate_password_hash


class TestConfig:
    TESTING = True
    SECRET_KEY = "test"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGINS = ["http://localhost:5173"]
    CONTACT_RATE_LIMIT_SECONDS = 60
    ADMIN_USERNAME = "admin"
    ADMIN_PASSWORD_HASH = generate_password_hash("secret-password")
    ADMIN_TOKEN_MAX_AGE_SECONDS = 43200
    MAX_RESUME_BYTES = 1024
    MAX_IMAGE_BYTES = 1024
    STORAGE_BACKEND = "local"
    UPLOAD_FOLDER = "/tmp/portfolio-test-uploads"
    SMTP_HOST = ""
    SMTP_PORT = 587
    SMTP_USERNAME = ""
    SMTP_PASSWORD = ""
    SMTP_USE_TLS = True
    CONTACT_NOTIFICATION_TO = ""
    CONTACT_NOTIFICATION_FROM = ""


def make_client(config=TestConfig):
    recent_submissions.clear()
    app = create_app(config)
    with app.app_context():
        db.create_all()
    return app.test_client()


def admin_token(client):
    response = client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "secret-password"},
    )
    assert response.status_code == 200
    return response.get_json()["token"]


def auth_headers(client):
    return {"Authorization": f"Bearer {admin_token(client)}"}


def test_health_endpoint():
    client = make_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.get_json()
    assert body["status"] == "ok"
    assert body["database"] == "sqlite"
    assert body["storage"] == "local"
    assert body["durable"] is False


def test_contact_validation():
    client = make_client()
    response = client.post("/api/contact", json={"name": "A", "email": "bad", "message": "short"})
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_contact_submission():
    client = make_client()
    response = client.post(
        "/api/contact",
        json={
            "name": "Recruiter",
            "email": "recruiter@example.com",
            "inquiryType": "Job Opportunity",
            "message": "I would like to discuss a full-stack engineering opportunity.",
        },
    )
    assert response.status_code == 201
    assert response.get_json() == {"message": "Message received."}


def test_contact_rate_limit():
    client = make_client()
    payload = {
        "name": "Recruiter",
        "email": "recruiter@example.com",
        "inquiryType": "Job Opportunity",
        "message": "I would like to discuss a full-stack engineering opportunity.",
    }
    assert client.post("/api/contact", json=payload).status_code == 201
    assert client.post("/api/contact", json=payload).status_code == 429


def test_admin_login_success_and_invalid_login():
    client = make_client()
    assert client.post("/api/admin/login", json={"username": "admin", "password": "secret-password"}).status_code == 200
    response = client.post("/api/admin/login", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 401


def test_protected_endpoint_rejects_unauthorized_writes():
    client = make_client()
    response = client.post(
        "/api/admin/projects",
        json={"title": "Private Draft", "shortDescription": "Should not write."},
    )
    assert response.status_code == 401


def test_project_create_update_retrieval_and_archive():
    client = make_client()
    headers = auth_headers(client)
    response = client.post(
        "/api/admin/projects",
        headers=headers,
        json={
            "title": "Recovery Project",
            "shortDescription": "A project I am actively finishing.",
            "status": "In Progress",
            "githubUrl": "https://github.com/Chariey-01/example",
            "technologies": ["React", "Flask"],
        },
    )
    assert response.status_code == 201
    project = response.get_json()
    assert project["liveUrl"] is None

    update = client.patch(
        f"/api/admin/projects/{project['id']}",
        headers=headers,
        json={"liveUrl": "https://example.com", "status": "Live", "featured": True},
    )
    assert update.status_code == 200
    assert update.get_json()["status"] == "Live"

    public = client.get("/api/projects").get_json()
    assert any(item["title"] == "Recovery Project" for item in public)

    archived = client.delete(f"/api/admin/projects/{project['id']}", headers=headers)
    assert archived.status_code == 200
    public_after_archive = client.get("/api/projects").get_json()
    assert all(item["title"] != "Recovery Project" for item in public_after_archive)


def test_public_projects_seed_existing_content_and_statuses():
    client = make_client()
    response = client.get("/api/projects")
    assert response.status_code == 200
    titles = [project["title"] for project in response.get_json()]
    assert "AuRevia" in titles
    assert "Delivaroo" in titles
    assert "CampusPulse" in titles
    assert "Learning Roadmap App" in titles
    live_urls = {project["title"]: project["liveUrl"] for project in response.get_json()}
    assert live_urls["Delivaroo"] == "https://delivaroo.vercel.app"
    assert live_urls["CampusPulse"] == "https://campuspulse-two.vercel.app"
    assert all(not (url or "").endswith(".onrender.com") for url in live_urls.values())


def test_resume_valid_pdf_upload_invalid_file_and_size_validation():
    client = make_client()
    headers = auth_headers(client)
    valid = client.post(
        "/api/admin/resume",
        headers=headers,
        data={"resume": (BytesIO(b"%PDF-1.4\nok"), "resume.pdf")},
        content_type="multipart/form-data",
    )
    assert valid.status_code == 201
    assert client.get("/api/resume").status_code == 200

    invalid = client.post(
        "/api/admin/resume",
        headers=headers,
        data={"resume": (BytesIO(b"not a pdf"), "resume.pdf")},
        content_type="multipart/form-data",
    )
    assert invalid.status_code == 400

    too_large = client.post(
        "/api/admin/resume",
        headers=headers,
        data={"resume": (BytesIO(b"%PDF-" + b"x" * 2048), "large.pdf")},
        content_type="multipart/form-data",
    )
    assert too_large.status_code == 400


def test_reusable_document_upload_current_public_and_archive():
    client = make_client()
    headers = auth_headers(client)
    first = client.post(
        "/api/admin/documents",
        headers=headers,
        data={
            "document": (BytesIO(b"%PDF-1.4\ncv one"), "cv.pdf"),
            "documentType": "CV",
            "title": "CV",
            "downloadLabel": "Download CV",
        },
        content_type="multipart/form-data",
    )
    assert first.status_code == 201
    first_document = first.get_json()["document"]
    assert first_document["documentType"] == "CV"
    assert client.get("/api/documents/cv").status_code == 200

    second = client.post(
        "/api/admin/documents",
        headers=headers,
        data={
            "document": (BytesIO(b"%PDF-1.4\ncv two"), "cv-2.pdf"),
            "documentType": "CV",
            "title": "CV",
        },
        content_type="multipart/form-data",
    )
    assert second.status_code == 201
    documents = client.get("/api/admin/documents", headers=headers).get_json()
    current_cvs = [document for document in documents if document["documentType"] == "CV" and document["isCurrent"]]
    assert len(current_cvs) == 1
    assert current_cvs[0]["id"] == second.get_json()["document"]["id"]

    private = client.patch(
        f"/api/admin/documents/{current_cvs[0]['id']}",
        headers=headers,
        json={"isPublic": False},
    )
    assert private.status_code == 200
    assert client.get("/api/documents/cv").status_code == 404

    archived = client.delete(f"/api/admin/documents/{first_document['id']}", headers=headers)
    assert archived.status_code == 200
    assert archived.get_json()["archived"] is True


def test_cover_letter_valid_pdf_upload_and_current_retrieval():
    client = make_client()
    headers = auth_headers(client)
    valid = client.post(
        "/api/admin/cover-letter",
        headers=headers,
        data={"coverLetter": (BytesIO(b"%PDF-1.4\ncover letter"), "cover-letter.pdf")},
        content_type="multipart/form-data",
    )
    assert valid.status_code == 201
    assert valid.get_json()["coverLetter"]["storageUrl"].startswith("/api/uploads/documents/cover-letter/")

    public = client.get("/api/cover-letter")
    assert public.status_code == 200
    assert public.get_json()["coverLetter"]["isCurrent"] is True


def test_admin_contact_messages_include_inquiry_type_and_archive():
    client = make_client()
    payload = {
        "name": "Hiring Manager",
        "email": "hiring@example.com",
        "inquiryType": "Technical Discussion",
        "message": "I would like to talk about your Flask and React portfolio architecture.",
    }
    assert client.post("/api/contact", json=payload).status_code == 201

    headers = auth_headers(client)
    inbox = client.get("/api/admin/contact-messages", headers=headers)
    assert inbox.status_code == 200
    message = inbox.get_json()[0]
    assert message["inquiryType"] == "Technical Discussion"

    archived = client.delete(f"/api/admin/contact-messages/{message['id']}", headers=headers)
    assert archived.status_code == 200
    assert archived.get_json()["archived"] is True


def test_testimonials_create_approve_and_public_filtering():
    client = make_client()
    headers = auth_headers(client)
    draft = client.post(
        "/api/admin/testimonials",
        headers=headers,
        json={"personName": "Mentor", "text": "Charity follows through on hard projects."},
    )
    assert draft.status_code == 201
    assert client.get("/api/testimonials").get_json() == []

    approved = client.patch(
        f"/api/admin/testimonials/{draft.get_json()['id']}",
        headers=headers,
        json={"approved": True},
    )
    assert approved.status_code == 200
    public = client.get("/api/testimonials").get_json()
    assert public[0]["personName"] == "Mentor"


def test_profile_retrieval_and_admin_update():
    client = make_client()
    public = client.get("/api/profile")
    assert public.status_code == 200
    assert "not been perfectly linear" in public.get_json()["story"]

    updated = client.patch(
        "/api/admin/profile",
        headers=auth_headers(client),
        json={"headline": "Building practical full-stack systems."},
    )
    assert updated.status_code == 200
    assert updated.get_json()["headline"] == "Building practical full-stack systems."


def test_normalize_database_url_accepts_postgres_scheme():
    assert normalize_database_url("postgres://user:pass@host/db") == "postgresql+psycopg://user:pass@host/db"
    assert (
        normalize_database_url("postgresql://user:pass@host/db?sslmode=require")
        == "postgresql+psycopg://user:pass@host/db?sslmode=require"
    )
    assert normalize_database_url("postgresql+psycopg://user:pass@host/db") == "postgresql+psycopg://user:pass@host/db"
    assert normalize_database_url("sqlite:///portfolio.db") == "sqlite:///portfolio.db"


def test_seed_adds_missing_projects_without_replacing_existing_rows():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        db.session.add(
            Project(
                title="Custom AuRevia",
                slug="aurevia",
                short_description="Keep this description.",
                technologies=["React"],
                status="Live",
                github_url="https://github.com/Chariey-01/custom-aurevia",
            )
        )
        db.session.commit()
    client = app.test_client()
    payload = client.get("/api/projects").get_json()
    by_slug = {project["slug"]: project for project in payload}
    assert by_slug["aurevia"]["title"] == "Custom AuRevia"
    assert by_slug["aurevia"]["summary"] == "Keep this description."
    assert by_slug["aurevia"]["githubUrl"] == "https://github.com/Chariey-01/custom-aurevia"
    assert by_slug["aurevia"]["imageUrl"] == "/images/projects/aurevia.jpg"
    assert by_slug["aurevia"]["liveUrl"] == "https://react-personal-projects-showcase-ap.vercel.app/"
    assert "delivaroo" in by_slug
    assert "campuspulse" in by_slug


def test_database_storage_keeps_uploads_out_of_the_filesystem(tmp_path):
    class DatabaseStorageConfig(TestConfig):
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{tmp_path / 'portfolio.db'}"
        STORAGE_BACKEND = "database"
        UPLOAD_FOLDER = str(tmp_path / "uploads")

    client = make_client(DatabaseStorageConfig)
    headers = auth_headers(client)
    uploaded = client.post(
        "/api/admin/resume",
        headers=headers,
        data={"resume": (BytesIO(b"%PDF-1.4\nok"), "resume.pdf")},
        content_type="multipart/form-data",
    )
    assert uploaded.status_code == 201
    storage_url = uploaded.get_json()["resume"]["storageUrl"]
    downloaded = client.get(storage_url)
    assert downloaded.status_code == 200
    assert downloaded.data.startswith(b"%PDF-")
    assert downloaded.mimetype == "application/pdf"
    assert not (tmp_path / "uploads").exists()

    project_id = client.get("/api/projects").get_json()[0]["id"]
    image = client.post(
        f"/api/admin/projects/{project_id}/image",
        headers=headers,
        data={"image": (BytesIO(b"\xff\xd8\xff" + b"\x00" * 32), "shot.jpg")},
        content_type="multipart/form-data",
    )
    assert image.status_code == 200
    image_response = client.get(image.get_json()["imageUrl"])
    assert image_response.status_code == 200
    assert image_response.data.startswith(b"\xff\xd8\xff")
    assert client.get("/api/uploads/../secret").status_code == 400
    assert is_safe_storage_key("../secret") is False
    assert is_safe_storage_key("documents/resume/file.pdf") is True


def test_production_database_requirement_blocks_sqlite_writes():
    app = create_app(TestConfig)
    error = prepare_production_database(app)
    assert error is not None
    assert "PostgreSQL" in error
    app.config["PERSISTENCE_ERROR"] = error
    client = app.test_client()
    health = client.get("/api/health")
    assert health.status_code == 503
    assert health.get_json()["database"] == "unavailable"
    body = health.get_data(as_text=True)
    assert "portfolio.db" not in body
    assert "://" not in body
    assert client.get("/api/projects").status_code == 503
    rejected = client.post(
        "/api/contact",
        json={
            "name": "Recruiter",
            "email": "recruiter@example.com",
            "inquiryType": "Job Opportunity",
            "message": "I would like to discuss a full-stack engineering opportunity.",
        },
    )
    assert rejected.status_code == 503
