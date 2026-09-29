from __future__ import annotations

import re

from ..default_content import (
    DEFAULT_EDUCATION,
    DEFAULT_EXPERIENCE,
    DEFAULT_PROFILE,
    DEFAULT_PROJECTS,
    DEFAULT_SKILLS,
    DEFAULT_SOCIAL_LINKS,
)
from ..extensions import db
from ..models import (
    ContactMessage,
    CoverLetter,
    Document,
    Education,
    Experience,
    Profile,
    Project,
    ProjectImage,
    Resume,
    Skill,
    SocialLink,
    Testimonial,
)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "project"


def ensure_default_content() -> None:
    """Seed only missing owner content so fresh databases preserve the portfolio."""
    changed = False
    if Profile.query.first() is None:
        db.session.add(Profile(**DEFAULT_PROFILE))
        changed = True

    if Project.query.first() is None:
        for project in DEFAULT_PROJECTS:
            db.session.add(Project(**project))
        changed = True

    for model, rows in [
        (Skill, DEFAULT_SKILLS),
        (Experience, DEFAULT_EXPERIENCE),
        (Education, DEFAULT_EDUCATION),
        (SocialLink, DEFAULT_SOCIAL_LINKS),
    ]:
        if model.query.first() is None:
            for row in rows:
                db.session.add(model(**row))
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
        "longDescription": project.long_description,
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
        "solution": project.solution,
        "architecture": project.architecture or [],
        "technicalDecisions": project.technical_decisions or [],
        "highlights": project.highlights or [],
        "technicalChallenges": project.technical_challenges or [],
        "lessons": project.lessons or [],
        "result": project.result,
        "year": project.year,
        "published": project.published,
        "accentFrom": project.accent_from,
        "accentTo": project.accent_to,
        "images": [serialize_project_image(image) for image in project.images],
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
        "handled": message.handled,
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


def serialize_project_image(image: ProjectImage) -> dict:
    return {
        "id": image.id,
        "imageUrl": image.image_url,
        "altText": image.alt_text,
        "caption": image.caption,
        "displayOrder": image.display_order,
    }


def serialize_skill(skill: Skill) -> dict:
    return {
        "id": skill.id,
        "category": skill.category,
        "name": skill.name,
        "detail": skill.detail,
        "familiarity": skill.familiarity,
        "displayOrder": skill.display_order,
        "archived": skill.archived,
    }


def serialize_experience(item: Experience) -> dict:
    return {
        "id": item.id,
        "label": item.label,
        "title": item.title,
        "organization": item.organization,
        "description": item.description,
        "startDate": item.start_date,
        "endDate": item.end_date,
        "displayOrder": item.display_order,
        "archived": item.archived,
    }


def serialize_education(item: Education) -> dict:
    return {
        "id": item.id,
        "institution": item.institution,
        "program": item.program,
        "description": item.description,
        "startDate": item.start_date,
        "endDate": item.end_date,
        "displayOrder": item.display_order,
        "archived": item.archived,
    }


def serialize_social_link(link: SocialLink) -> dict:
    return {
        "id": link.id,
        "label": link.label,
        "url": link.url,
        "displayOrder": link.display_order,
        "archived": link.archived,
    }
