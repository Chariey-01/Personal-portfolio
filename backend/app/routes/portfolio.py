from pathlib import Path

from flask import Blueprint, current_app, jsonify, request, send_from_directory

from ..extensions import db
from ..models import ContactMessage, CoverLetter, Document, Profile, Project, Resume, Testimonial
from ..services.auth import create_admin_token, require_admin, verify_admin_credentials
from ..services.cms import (
    current_document,
    ensure_default_content,
    serialize_contact_message,
    serialize_document,
    serialize_profile,
    serialize_project,
    serialize_cover_letter,
    serialize_resume,
    serialize_testimonial,
    slugify,
)
from ..services.storage import UploadValidationError, save_cover_letter_pdf, save_document_pdf, save_image, save_resume_pdf

portfolio_bp = Blueprint("portfolio", __name__)

PROJECT_STATUSES = {"In Progress", "Completed", "Live", "Archived"}
DOCUMENT_TYPES = {"RESUME", "CV", "COVER_LETTER", "OTHER"}


@portfolio_bp.get("/profile")
def profile():
    ensure_default_content()
    return jsonify(serialize_profile(Profile.query.first()))


@portfolio_bp.get("/projects")
def projects():
    ensure_default_content()
    rows = (
        Project.query.filter_by(archived=False)
        .order_by(Project.featured.desc(), Project.display_order.asc(), Project.updated_at.desc())
        .all()
    )
    return jsonify([serialize_project(project) for project in rows])


@portfolio_bp.get("/projects/<slug>")
def project_detail(slug):
    ensure_default_content()
    project = Project.query.filter_by(slug=slug, archived=False).first_or_404()
    return jsonify(serialize_project(project))


@portfolio_bp.get("/testimonials")
def testimonials():
    rows = (
        Testimonial.query.filter_by(approved=True, archived=False)
        .order_by(Testimonial.display_order.asc(), Testimonial.created_at.desc())
        .all()
    )
    return jsonify([serialize_testimonial(testimonial) for testimonial in rows])


@portfolio_bp.get("/resume")
def current_resume():
    document = current_document("RESUME")
    if document is not None:
        return jsonify({"resume": serialize_document(document)})
    resume = Resume.query.filter_by(is_current=True).order_by(Resume.uploaded_at.desc()).first()
    if resume is None:
        return jsonify({"resume": None}), 404
    return jsonify({"resume": serialize_resume(resume)})


@portfolio_bp.get("/cover-letter")
def current_cover_letter():
    document = current_document("COVER_LETTER")
    if document is not None:
        return jsonify({"coverLetter": serialize_document(document)})
    cover_letter = CoverLetter.query.filter_by(is_current=True).order_by(CoverLetter.uploaded_at.desc()).first()
    if cover_letter is None:
        return jsonify({"coverLetter": None}), 404
    return jsonify({"coverLetter": serialize_cover_letter(cover_letter)})


@portfolio_bp.get("/uploads/<path:storage_key>")
def uploaded_file(storage_key):
    root = Path(current_app.config["UPLOAD_FOLDER"]).resolve()
    target = (root / storage_key).resolve()
    if root not in target.parents:
        return jsonify({"error": "Invalid file path."}), 400
    return send_from_directory(target.parent, target.name, as_attachment=False)


@portfolio_bp.get("/documents/<document_type>")
def public_document(document_type):
    normalized_type = document_type.upper().replace("-", "_")
    if normalized_type not in DOCUMENT_TYPES:
        return jsonify({"error": "Invalid document type."}), 400
    document = current_document(normalized_type)
    if document is None:
        return jsonify({"document": None}), 404
    return jsonify({"document": serialize_document(document)})


@portfolio_bp.post("/admin/login")
def admin_login():
    payload = request.get_json(silent=True) or {}
    username = str(payload.get("username", ""))
    password = str(payload.get("password", ""))
    if not verify_admin_credentials(username, password):
        return jsonify({"error": "Invalid admin credentials."}), 401
    return jsonify({"token": create_admin_token(username)})


@portfolio_bp.get("/admin/profile")
@require_admin
def admin_profile():
    ensure_default_content()
    return jsonify(serialize_profile(Profile.query.first()))


@portfolio_bp.patch("/admin/profile")
@require_admin
def update_profile():
    ensure_default_content()
    profile_row = Profile.query.first()
    payload = request.get_json(silent=True) or {}
    for field in [
        "name",
        "alias",
        "location",
        "role",
        "email",
        "headline",
        "bio",
        "story",
        "availability",
    ]:
        if field in payload:
            setattr(profile_row, field, payload[field])
    if "profileImage" in payload:
        profile_row.profile_image_url = payload["profileImage"]
    if "profileImageAlt" in payload:
        profile_row.profile_image_alt = payload["profileImageAlt"]
    if "links" in payload and isinstance(payload["links"], list):
        profile_row.links = payload["links"]
    if "focusStack" in payload and isinstance(payload["focusStack"], list):
        profile_row.focus_stack = payload["focusStack"]
    db.session.commit()
    return jsonify(serialize_profile(profile_row))


@portfolio_bp.post("/admin/profile/image")
@require_admin
def upload_profile_image():
    ensure_default_content()
    try:
        saved = save_image(request.files.get("image"), "profile")
    except UploadValidationError as exc:
        return jsonify({"error": str(exc)}), 400
    profile_row = Profile.query.first()
    profile_row.profile_image_url = saved["storage_url"]
    db.session.commit()
    return jsonify(serialize_profile(profile_row))


@portfolio_bp.get("/admin/projects")
@require_admin
def admin_projects():
    ensure_default_content()
    rows = Project.query.order_by(Project.display_order.asc(), Project.updated_at.desc()).all()
    return jsonify([serialize_project(project) for project in rows])


@portfolio_bp.post("/admin/projects")
@require_admin
def create_project():
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title", "")).strip()
    short_description = str(payload.get("shortDescription", "")).strip()
    if not title or not short_description:
        return jsonify({"error": "Project title and short description are required."}), 400

    slug = str(payload.get("slug") or slugify(title))
    if Project.query.filter_by(slug=slug).first():
        return jsonify({"error": "A project with this slug already exists."}), 400

    project = Project(title=title, slug=slug, short_description=short_description)
    try:
        _apply_project_payload(project, payload)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    db.session.add(project)
    db.session.commit()
    return jsonify(serialize_project(project)), 201


@portfolio_bp.patch("/admin/projects/<int:project_id>")
@require_admin
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    payload = request.get_json(silent=True) or {}
    try:
        _apply_project_payload(project, payload)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    db.session.commit()
    return jsonify(serialize_project(project))


@portfolio_bp.delete("/admin/projects/<int:project_id>")
@require_admin
def archive_project(project_id):
    project = Project.query.get_or_404(project_id)
    project.archived = True
    project.status = "Archived"
    db.session.commit()
    return jsonify(serialize_project(project))


@portfolio_bp.post("/admin/projects/<int:project_id>/image")
@require_admin
def upload_project_image(project_id):
    project = Project.query.get_or_404(project_id)
    try:
        saved = save_image(request.files.get("image"), "projects")
    except UploadValidationError as exc:
        return jsonify({"error": str(exc)}), 400
    project.image_url = saved["storage_url"]
    db.session.commit()
    return jsonify(serialize_project(project))


@portfolio_bp.get("/admin/documents")
@require_admin
def admin_documents():
    rows = Document.query.order_by(Document.document_type.asc(), Document.uploaded_at.desc()).all()
    return jsonify([serialize_document(document) for document in rows])


@portfolio_bp.post("/admin/documents")
@require_admin
def upload_document():
    document_type = str(request.form.get("documentType", "RESUME")).upper()
    if document_type not in DOCUMENT_TYPES:
        return jsonify({"error": "Invalid document type."}), 400

    try:
        saved = save_document_pdf(request.files.get("document"), document_type)
    except UploadValidationError as exc:
        return jsonify({"error": str(exc)}), 400

    title = str(request.form.get("title", "")).strip() or _default_document_title(document_type)
    is_public = request.form.get("isPublic", "true").lower() != "false"
    is_current = request.form.get("isCurrent", "true").lower() != "false"
    download_label = str(request.form.get("downloadLabel", "")).strip() or f"Download {title}"

    if is_current:
        Document.query.filter_by(document_type=document_type).update({"is_current": False})

    document = Document(
        title=title,
        document_type=document_type,
        is_current=is_current,
        is_public=is_public,
        download_label=download_label,
        **saved,
    )
    db.session.add(document)
    db.session.commit()
    return jsonify({"document": serialize_document(document)}), 201


@portfolio_bp.patch("/admin/documents/<int:document_id>")
@require_admin
def update_document(document_id):
    document = Document.query.get_or_404(document_id)
    payload = request.get_json(silent=True) or {}
    if "title" in payload:
        document.title = str(payload["title"]).strip() or document.title
    if "downloadLabel" in payload:
        document.download_label = str(payload["downloadLabel"]).strip() or document.download_label
    if "isPublic" in payload:
        document.is_public = bool(payload["isPublic"])
    if "isCurrent" in payload:
        document.is_current = bool(payload["isCurrent"])
        if document.is_current:
            Document.query.filter(
                Document.document_type == document.document_type,
                Document.id != document.id,
            ).update({"is_current": False})
    if "archived" in payload:
        document.archived = bool(payload["archived"])
        if document.archived:
            document.is_current = False
            document.is_public = False
    db.session.commit()
    return jsonify(serialize_document(document))


@portfolio_bp.delete("/admin/documents/<int:document_id>")
@require_admin
def archive_document(document_id):
    document = Document.query.get_or_404(document_id)
    document.archived = True
    document.is_current = False
    document.is_public = False
    db.session.commit()
    return jsonify(serialize_document(document))


@portfolio_bp.post("/admin/resume")
@require_admin
def upload_resume():
    try:
        saved = save_document_pdf(request.files.get("resume"), "RESUME")
    except UploadValidationError as exc:
        return jsonify({"error": str(exc)}), 400

    Document.query.filter_by(document_type="RESUME").update({"is_current": False})
    resume = Document(
        title="Resume",
        document_type="RESUME",
        download_label="Download Resume",
        is_current=True,
        is_public=True,
        **saved,
    )
    db.session.add(resume)
    db.session.commit()
    return jsonify({"resume": serialize_document(resume)}), 201


@portfolio_bp.post("/admin/cover-letter")
@require_admin
def upload_cover_letter():
    try:
        saved = save_document_pdf(request.files.get("coverLetter"), "COVER_LETTER")
    except UploadValidationError as exc:
        return jsonify({"error": str(exc)}), 400

    Document.query.filter_by(document_type="COVER_LETTER").update({"is_current": False})
    cover_letter = Document(
        title="Cover Letter",
        document_type="COVER_LETTER",
        download_label="Download Cover Letter",
        is_current=True,
        is_public=True,
        **saved,
    )
    db.session.add(cover_letter)
    db.session.commit()
    return jsonify({"coverLetter": serialize_document(cover_letter)}), 201


@portfolio_bp.get("/admin/contact-messages")
@require_admin
def admin_contact_messages():
    rows = ContactMessage.query.filter_by(archived=False).order_by(ContactMessage.created_at.desc()).limit(100).all()
    return jsonify([serialize_contact_message(message) for message in rows])


@portfolio_bp.delete("/admin/contact-messages/<int:message_id>")
@require_admin
def archive_contact_message(message_id):
    message = ContactMessage.query.get_or_404(message_id)
    message.archived = True
    db.session.commit()
    return jsonify(serialize_contact_message(message))


@portfolio_bp.get("/admin/testimonials")
@require_admin
def admin_testimonials():
    rows = Testimonial.query.order_by(Testimonial.display_order.asc(), Testimonial.created_at.desc()).all()
    return jsonify([serialize_testimonial(testimonial) for testimonial in rows])


@portfolio_bp.post("/admin/testimonials")
@require_admin
def create_testimonial():
    payload = request.get_json(silent=True) or {}
    person_name = str(payload.get("personName", "")).strip()
    text = str(payload.get("text", "")).strip()
    if not person_name or not text:
        return jsonify({"error": "Name and testimonial text are required."}), 400
    testimonial = Testimonial(person_name=person_name, text=text)
    _apply_testimonial_payload(testimonial, payload)
    db.session.add(testimonial)
    db.session.commit()
    return jsonify(serialize_testimonial(testimonial)), 201


@portfolio_bp.patch("/admin/testimonials/<int:testimonial_id>")
@require_admin
def update_testimonial(testimonial_id):
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    payload = request.get_json(silent=True) or {}
    _apply_testimonial_payload(testimonial, payload)
    db.session.commit()
    return jsonify(serialize_testimonial(testimonial))


@portfolio_bp.delete("/admin/testimonials/<int:testimonial_id>")
@require_admin
def archive_testimonial(testimonial_id):
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    testimonial.archived = True
    testimonial.approved = False
    db.session.commit()
    return jsonify(serialize_testimonial(testimonial))


def _apply_project_payload(project: Project, payload: dict) -> None:
    field_map = {
        "title": "title",
        "slug": "slug",
        "shortDescription": "short_description",
        "caseStudy": "case_study",
        "role": "role",
        "githubUrl": "github_url",
        "liveUrl": "live_url",
        "imageUrl": "image_url",
        "problem": "problem",
    }
    for external, internal in field_map.items():
        if external in payload:
            setattr(project, internal, payload[external])

    if "status" in payload:
        status = payload["status"]
        if status not in PROJECT_STATUSES:
            raise ValueError("Invalid project status.")
        project.status = status
    for external, internal in {
        "technologies": "technologies",
        "architecture": "architecture",
        "highlights": "highlights",
        "technicalChallenges": "technical_challenges",
    }.items():
        if external in payload and isinstance(payload[external], list):
            setattr(project, internal, payload[external])
    if "featured" in payload:
        project.featured = bool(payload["featured"])
    if "archived" in payload:
        project.archived = bool(payload["archived"])
    if "displayOrder" in payload:
        project.display_order = int(payload["displayOrder"] or 0)


def _default_document_title(document_type: str) -> str:
    return {
        "RESUME": "Resume",
        "CV": "CV",
        "COVER_LETTER": "Cover Letter",
        "OTHER": "Document",
    }[document_type]


def _apply_testimonial_payload(testimonial: Testimonial, payload: dict) -> None:
    field_map = {
        "personName": "person_name",
        "role": "role",
        "organization": "organization",
        "text": "text",
        "imageUrl": "image_url",
        "profileUrl": "profile_url",
    }
    for external, internal in field_map.items():
        if external in payload:
            setattr(testimonial, internal, payload[external])
    if "approved" in payload:
        testimonial.approved = bool(payload["approved"])
    if "archived" in payload:
        testimonial.archived = bool(payload["archived"])
    if "displayOrder" in payload:
        testimonial.display_order = int(payload["displayOrder"] or 0)
