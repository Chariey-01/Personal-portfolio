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
    handled = db.Column(db.Boolean, default=False, nullable=False)
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
    long_description = db.Column(db.Text, nullable=True)
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
    solution = db.Column(db.Text, nullable=True)
    architecture = db.Column(db.JSON, nullable=False, default=list)
    technical_decisions = db.Column(db.JSON, nullable=False, default=list)
    highlights = db.Column(db.JSON, nullable=False, default=list)
    technical_challenges = db.Column(db.JSON, nullable=False, default=list)
    lessons = db.Column(db.JSON, nullable=False, default=list)
    result = db.Column(db.Text, nullable=True)
    year = db.Column(db.Integer, nullable=True)
    published = db.Column(db.Boolean, default=True, nullable=False)
    accent_from = db.Column(db.String(20), nullable=True)
    accent_to = db.Column(db.String(20), nullable=True)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
    images = db.relationship(
        "ProjectImage",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="ProjectImage.display_order",
    )


class ProjectImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(255), nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    project = db.relationship("Project", back_populates="images")


class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    detail = db.Column(db.String(255), nullable=False)
    familiarity = db.Column(db.String(40), default="Worked with", nullable=False)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(160), nullable=False)
    organization = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.String(40), nullable=True)
    end_date = db.Column(db.String(40), nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)


class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    institution = db.Column(db.String(160), nullable=False)
    program = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.String(40), nullable=True)
    end_date = db.Column(db.String(40), nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)


class SocialLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(80), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)


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
