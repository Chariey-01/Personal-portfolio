from __future__ import annotations

import re

from ..default_content import DEFAULT_PROFILE, DEFAULT_PROJECTS
from ..extensions import db
from ..models import ContactMessage, CoverLetter, Document, Profile, Project, Resume, Testimonial


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "project"


def ensure_default_content() -> None:
    """Add missing profile and project rows without overwriting records that already exist."""
    changed = False
    if Profile.query.first() is None:
        db.session.add(Profile(**DEFAULT_PROFILE))
        changed = True

    existing_slugs = {slug for (slug,) in db.session.query(Project.slug).all()}
    for project in DEFAULT_PROJECTS:
        if project["slug"] in existing_slugs:
            continue
        db.session.add(Project(**project))
        changed = True

    if changed:
        db.session.commit()


def serialize_profile(profile: Profile) -> dict:
    current_resume = current_document("RESUME")
    current_cv = current_document("CV")
    current_cover_letter = current_document("COVER_LETTER")
    legacy_resume = Resume.query.filter_by(is_current=True).order_by(Resume.uploaded_at.desc()).first()
    legacy_cover_letter = (
        CoverLetter.query.filter_by(is_current=True).order_by(CoverLetter.uploaded_at.desc()).first()
    )
    return {
        "id": profile.id,
        "name": profile.name,
        "alias": profile.alias,
        "location": profile.location,
        "role": profile.role,
        "email": profile.email,
        "headline": profile.headline,
        "bio": profile.bio,
        "story": profile.story,
        "profileImage": profile.profile_image_url,
        "profileImageAlt": profile.profile_image_alt,
        "availability": profile.availability,
        "focusStack": profile.focus_stack or [],
        "links": profile.links or [],
        "resumeUrl": current_resume.storage_url if current_resume else (legacy_resume.storage_url if legacy_resume else None),
        "cvUrl": current_cv.storage_url if current_cv else None,
        "coverLetterUrl": current_cover_letter.storage_url
        if current_cover_letter
        else (legacy_cover_letter.storage_url if legacy_cover_letter else None),
    }


def serialize_project(project: Project) -> dict:
    return {
        "id": project.id,
        "title": project.title,
        "slug": project.slug,
        "shortDescription": project.short_description,
        "summary": project.short_description,
        "caseStudy": project.case_study,
        "role": project.role,
        "technologies": project.technologies or [],
        "stack": project.technologies or [],
        "githubUrl": project.github_url,
        "repoUrl": project.github_url,
        "liveUrl": project.live_url,
        "imageUrl": project.image_url,
        "featured": project.featured,
        "status": project.status,
        "displayOrder": project.display_order,
        "problem": project.problem,
        "architecture": project.architecture or [],
        "highlights": project.highlights or [],
        "technicalChallenges": project.technical_challenges or [],
        "archived": project.archived,
        "createdAt": project.created_at.isoformat() if project.created_at else None,
        "updatedAt": project.updated_at.isoformat() if project.updated_at else None,
    }


def serialize_resume(resume: Resume | None) -> dict | None:
    if resume is None:
        return None
    return {
        "id": resume.id,
        "filename": resume.filename,
        "originalFilename": resume.original_filename,
        "storageUrl": resume.storage_url,
        "uploadedAt": resume.uploaded_at.isoformat() if resume.uploaded_at else None,
        "isCurrent": resume.is_current,
    }


def serialize_cover_letter(cover_letter: CoverLetter | None) -> dict | None:
    if cover_letter is None:
        return None
    return {
        "id": cover_letter.id,
        "filename": cover_letter.filename,
        "originalFilename": cover_letter.original_filename,
        "storageUrl": cover_letter.storage_url,
        "uploadedAt": cover_letter.uploaded_at.isoformat() if cover_letter.uploaded_at else None,
        "isCurrent": cover_letter.is_current,
    }


def current_document(document_type: str) -> Document | None:
    return (
        Document.query.filter_by(document_type=document_type, is_current=True, is_public=True, archived=False)
        .order_by(Document.uploaded_at.desc())
        .first()
    )


def serialize_document(document: Document | None) -> dict | None:
    if document is None:
        return None
    return {
        "id": document.id,
        "title": document.title,
        "documentType": document.document_type,
        "filename": document.filename,
        "originalFilename": document.original_filename,
        "storageUrl": document.storage_url,
        "uploadedAt": document.uploaded_at.isoformat() if document.uploaded_at else None,
        "isCurrent": document.is_current,
        "isPublic": document.is_public,
        "downloadLabel": document.download_label,
        "archived": document.archived,
    }


def serialize_contact_message(message: ContactMessage) -> dict:
    return {
        "id": message.id,
        "name": message.name,
        "email": message.email,
        "inquiryType": message.inquiry_type,
        "message": message.message,
        "createdAt": message.created_at.isoformat() if message.created_at else None,
        "archived": message.archived,
    }


def serialize_testimonial(testimonial: Testimonial) -> dict:
    return {
        "id": testimonial.id,
        "personName": testimonial.person_name,
        "role": testimonial.role,
        "organization": testimonial.organization,
        "text": testimonial.text,
        "imageUrl": testimonial.image_url,
        "profileUrl": testimonial.profile_url,
        "approved": testimonial.approved,
        "displayOrder": testimonial.display_order,
        "archived": testimonial.archived,
    }
