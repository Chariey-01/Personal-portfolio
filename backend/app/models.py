from datetime import datetime, timezone

from .extensions import db


def utc_now():
    return datetime.now(timezone.utc)


class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    inquiry_type = db.Column(db.String(80), nullable=False, default="Other")
    message = db.Column(db.Text, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    alias = db.Column(db.String(80), nullable=True)
    location = db.Column(db.String(120), nullable=True)
    role = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    headline = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    story = db.Column(db.Text, nullable=False)
    profile_image_url = db.Column(db.String(500), nullable=True)
    profile_image_alt = db.Column(db.String(255), nullable=True)
    availability = db.Column(db.String(160), nullable=True)
    links = db.Column(db.JSON, nullable=False, default=list)
    focus_stack = db.Column(db.JSON, nullable=False, default=list)
    updated_at = db.Column(db.DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    slug = db.Column(db.String(180), unique=True, nullable=False, index=True)
    short_description = db.Column(db.Text, nullable=False)
    case_study = db.Column(db.Text, nullable=True)
    role = db.Column(db.String(180), nullable=True)
    technologies = db.Column(db.JSON, nullable=False, default=list)
    github_url = db.Column(db.String(500), nullable=True)
    live_url = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    featured = db.Column(db.Boolean, default=False, nullable=False)
    status = db.Column(db.String(40), default="In Progress", nullable=False)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    problem = db.Column(db.Text, nullable=True)
    architecture = db.Column(db.JSON, nullable=False, default=list)
    highlights = db.Column(db.JSON, nullable=False, default=list)
    technical_challenges = db.Column(db.JSON, nullable=False, default=list)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    storage_url = db.Column(db.String(500), nullable=False)
    storage_key = db.Column(db.String(500), nullable=False)
    uploaded_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    is_current = db.Column(db.Boolean, default=False, nullable=False, index=True)


class CoverLetter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    storage_url = db.Column(db.String(500), nullable=False)
    storage_key = db.Column(db.String(500), nullable=False)
    uploaded_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    is_current = db.Column(db.Boolean, default=False, nullable=False, index=True)


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    document_type = db.Column(db.String(40), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    storage_url = db.Column(db.String(500), nullable=False)
    storage_key = db.Column(db.String(500), nullable=False)
    download_label = db.Column(db.String(120), nullable=True)
    uploaded_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    is_current = db.Column(db.Boolean, default=False, nullable=False, index=True)
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)


class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_name = db.Column(db.String(160), nullable=False)
    role = db.Column(db.String(160), nullable=True)
    organization = db.Column(db.String(160), nullable=True)
    text = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    profile_url = db.Column(db.String(500), nullable=True)
    approved = db.Column(db.Boolean, default=False, nullable=False)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
