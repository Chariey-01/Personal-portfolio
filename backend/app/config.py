import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///portfolio.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGINS = [
        origin.strip()
        for origin in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    CONTACT_RATE_LIMIT_SECONDS = int(os.getenv("CONTACT_RATE_LIMIT_SECONDS", "60"))
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
    ADMIN_TOKEN_MAX_AGE_SECONDS = int(os.getenv("ADMIN_TOKEN_MAX_AGE_SECONDS", "43200"))
    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        str(Path(__file__).resolve().parents[2] / "instance" / "uploads"),
    )
    MAX_RESUME_BYTES = int(os.getenv("MAX_RESUME_BYTES", str(5 * 1024 * 1024)))
    MAX_IMAGE_BYTES = int(os.getenv("MAX_IMAGE_BYTES", str(3 * 1024 * 1024)))
    STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() != "false"
    CONTACT_NOTIFICATION_TO = os.getenv("CONTACT_NOTIFICATION_TO", "")
    CONTACT_NOTIFICATION_FROM = os.getenv("CONTACT_NOTIFICATION_FROM", "")
