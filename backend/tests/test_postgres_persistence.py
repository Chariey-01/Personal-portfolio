"""Prove contact messages and uploads survive a new application instance."""

import os
from io import BytesIO

import psycopg
import pytest
from app import create_app
from app.config import normalize_database_url
from app.extensions import db
from app.models import ContactMessage, StoredFile
from app.routes.contact import recent_submissions
from app.services.persistence import MIGRATIONS_DIRECTORY, prepare_production_database
from sqlalchemy import text
from sqlalchemy.engine import make_url
from werkzeug.security import generate_password_hash


def _isolated_database_url(url: str) -> str:
    """Use a separate database so the reset cannot wipe a development database."""
    parsed = make_url(url)
    test_database = "portfolio_persistence_test"
    admin = parsed.set(database="postgres")
    with psycopg.connect(admin.render_as_string(hide_password=False), autocommit=True) as connection:
        exists = connection.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (test_database,),
        ).fetchone()
        if exists is None:
            connection.execute(f'CREATE DATABASE "{test_database}"')
    return parsed.set(database=test_database).render_as_string(hide_password=False)


def _postgres_config(url: str):
    class PostgresConfig:
        TESTING = True
        SECRET_KEY = "test"
        SQLALCHEMY_DATABASE_URI = normalize_database_url(url)
        SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        FRONTEND_ORIGINS = ["http://localhost:5173"]
        CONTACT_RATE_LIMIT_SECONDS = 60
        ADMIN_USERNAME = "admin"
        ADMIN_PASSWORD_HASH = generate_password_hash("secret-password")
        ADMIN_TOKEN_MAX_AGE_SECONDS = 43200
        MAX_RESUME_BYTES = 1024
        MAX_IMAGE_BYTES = 1024
        STORAGE_BACKEND = "database"
        UPLOAD_FOLDER = "/tmp/portfolio-test-uploads"
        SMTP_HOST = ""
        SMTP_PORT = 587
        SMTP_USERNAME = ""
        SMTP_PASSWORD = ""
        SMTP_USE_TLS = True
        CONTACT_NOTIFICATION_TO = ""
        CONTACT_NOTIFICATION_FROM = ""

    return PostgresConfig


def test_postgres_data_survives_a_new_app_instance():
    url = os.getenv("PERSISTENCE_TEST_DATABASE_URL", "")
    if not url:
        pytest.skip("PERSISTENCE_TEST_DATABASE_URL is not set")
    url = _isolated_database_url(url)

    recent_submissions.clear()
    app = create_app(_postgres_config(url))
    assert prepare_production_database(app) is None
    with app.app_context():
        db.session.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        db.session.execute(text("CREATE SCHEMA public"))
        db.session.commit()
    assert prepare_production_database(app) is None

    client = app.test_client()
    created = client.post(
        "/api/contact",
        json={
            "name": "Recruiter",
            "email": "recruiter@example.com",
            "inquiryType": "Job Opportunity",
            "message": "Please keep this message in PostgreSQL.",
        },
    )
    assert created.status_code == 201
    login = client.post("/api/admin/login", json={"username": "admin", "password": "secret-password"})
    headers = {"Authorization": f"Bearer {login.get_json()['token']}"}
    uploaded = client.post(
        "/api/admin/resume",
        headers=headers,
        data={"resume": (BytesIO(b"%PDF-1.4\nstored"), "resume.pdf")},
        content_type="multipart/form-data",
    )
    assert uploaded.status_code == 201
    storage_url = uploaded.get_json()["resume"]["storageUrl"]
    with app.app_context():
        db.engine.dispose()

    restarted = create_app(_postgres_config(url))
    restarted_client = restarted.test_client()
    login = restarted_client.post(
        "/api/admin/login",
        json={"username": "admin", "password": "secret-password"},
    )
    headers = {"Authorization": f"Bearer {login.get_json()['token']}"}
    messages = restarted_client.get("/api/admin/contact-messages", headers=headers)
    assert messages.status_code == 200
    assert any(item["message"] == "Please keep this message in PostgreSQL." for item in messages.get_json())
    downloaded = restarted_client.get(storage_url)
    assert downloaded.status_code == 200
    assert downloaded.data.startswith(b"%PDF-")
    with restarted.app_context():
        assert ContactMessage.query.count() == 1
        assert StoredFile.query.count() == 1
        db.session.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        db.session.execute(text("CREATE SCHEMA public"))
        db.session.commit()
        db.engine.dispose()

    assert MIGRATIONS_DIRECTORY.endswith("migrations")
