from __future__ import annotations

import uuid
from pathlib import Path

from flask import current_app
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from ..extensions import db
from ..models import StoredFile


PDF_SIGNATURE = b"%PDF-"
IMAGE_SIGNATURES = [
    (b"\xff\xd8\xff", ".jpg"),
    (b"\x89PNG\r\n\x1a\n", ".png"),
    (b"GIF87a", ".gif"),
    (b"GIF89a", ".gif"),
    (b"RIFF", ".webp"),
]


class UploadValidationError(ValueError):
    pass


CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
}


def is_safe_storage_key(storage_key: str) -> bool:
    if not storage_key or storage_key.startswith(("/", "\\")) or "\\" in storage_key:
        return False
    parts = Path(storage_key).parts
    return bool(parts) and ".." not in parts


def read_stored_file(storage_key: str) -> tuple[bytes, str] | None:
    row = StoredFile.query.filter_by(storage_key=storage_key).first()
    if row is None:
        return None
    return bytes(row.data), row.content_type


def _uses_database() -> bool:
    return current_app.config.get("STORAGE_BACKEND") == "database"


def _store_bytes(storage_key: str, data: bytes, content_type: str, folder: str, filename: str) -> None:
    if _uses_database():
        existing = StoredFile.query.filter_by(storage_key=storage_key).first()
        if existing is None:
            db.session.add(
                StoredFile(
                    storage_key=storage_key,
                    content_type=content_type,
                    data=data,
                    size_bytes=len(data),
                )
            )
        else:
            existing.content_type = content_type
            existing.data = data
            existing.size_bytes = len(data)
        db.session.flush()
        return

    destination = _upload_root(folder) / filename
    destination.write_bytes(data)


def _upload_root(kind: str) -> Path:
    root = Path(current_app.config["UPLOAD_FOLDER"]) / kind
    root.mkdir(parents=True, exist_ok=True)
    return root


def _read_for_validation(file: FileStorage, limit: int) -> bytes:
    data = file.stream.read(limit + 1)
    file.stream.seek(0)
    if len(data) > limit:
        raise UploadValidationError("File is too large.")
    return data


def save_pdf(file: FileStorage, folder: str, label: str) -> dict:
    """Store a validated PDF in PostgreSQL, or on the local disk during development."""
    if not file or not file.filename:
        raise UploadValidationError(f"{label} PDF is required.")

    data = _read_for_validation(file, current_app.config["MAX_RESUME_BYTES"])
    if not data.startswith(PDF_SIGNATURE):
        raise UploadValidationError("Upload must be a valid PDF file.")

    original = secure_filename(file.filename) or "resume.pdf"
    if not original.lower().endswith(".pdf"):
        original = f"{original}.pdf"
    filename = f"{uuid.uuid4().hex}.pdf"
    storage_key = f"{folder}/{filename}"
    _store_bytes(storage_key, data, "application/pdf", folder, filename)
    return {
        "filename": filename,
        "original_filename": original,
        "storage_key": storage_key,
        "storage_url": f"/api/uploads/{storage_key}",
    }


def save_resume_pdf(file: FileStorage) -> dict:
    return save_pdf(file, "resumes", "Resume")


def save_cover_letter_pdf(file: FileStorage) -> dict:
    return save_pdf(file, "cover-letters", "Cover letter")


def save_document_pdf(file: FileStorage, document_type: str) -> dict:
    folder = f"documents/{document_type.lower().replace('_', '-')}"
    return save_pdf(file, folder, "Document")


def save_image(file: FileStorage, folder: str) -> dict:
    if not file or not file.filename:
        raise UploadValidationError("Image file is required.")

    data = _read_for_validation(file, current_app.config["MAX_IMAGE_BYTES"])
    extension = _detect_image_extension(data)
    if extension is None:
        raise UploadValidationError("Upload must be a valid image.")

    original = secure_filename(file.filename) or f"image{extension}"
    filename = f"{uuid.uuid4().hex}{extension}"
    storage_key = f"{folder}/{filename}"
    _store_bytes(storage_key, data, CONTENT_TYPES[extension], folder, filename)
    return {
        "filename": filename,
        "original_filename": original,
        "storage_key": storage_key,
        "storage_url": f"/api/uploads/{storage_key}",
    }


def _detect_image_extension(data: bytes) -> str | None:
    for signature, extension in IMAGE_SIGNATURES:
        if data.startswith(signature):
            if extension == ".webp" and data[8:12] != b"WEBP":
                continue
            return extension
    return None
