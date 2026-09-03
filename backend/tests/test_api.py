from app import create_app
from app.extensions import db
from app.routes.contact import recent_submissions


class TestConfig:
    TESTING = True
    SECRET_KEY = "test"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGINS = ["http://localhost:5173"]
    CONTACT_RATE_LIMIT_SECONDS = 60


def make_client():
    recent_submissions.clear()
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
    return app.test_client()


def test_health_endpoint():
    client = make_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


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
        "message": "I would like to discuss a full-stack engineering opportunity.",
    }
    assert client.post("/api/contact", json=payload).status_code == 201
    assert client.post("/api/contact", json=payload).status_code == 429
