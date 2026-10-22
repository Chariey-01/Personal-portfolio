"""Startup checks for durable PostgreSQL storage."""

from pathlib import Path

from flask_migrate import upgrade

from .cms import ensure_default_content

MIGRATIONS_DIRECTORY = str(Path(__file__).resolve().parents[2] / "migrations")

DURABLE_DATABASE_ERROR = (
    "DATABASE_URL must be a PostgreSQL connection string. "
    "Temporary SQLite is disabled for this deployment."
)
DATABASE_UNAVAILABLE_ERROR = (
    "PostgreSQL is configured, but the database could not be reached or migrated."
)


def prepare_production_database(app) -> str | None:
    """Migrate and seed PostgreSQL.

    Returns a public error string when production cannot persist data.
    The string never includes the connection URL.
    """
    uri = app.config["SQLALCHEMY_DATABASE_URI"]
    if not uri.startswith("postgresql"):
        return DURABLE_DATABASE_ERROR
    try:
        with app.app_context():
            upgrade(directory=MIGRATIONS_DIRECTORY)
            ensure_default_content()
    except Exception as exc:
        app.logger.error("PostgreSQL migration failed: %s", type(exc).__name__)
        return DATABASE_UNAVAILABLE_ERROR
    return None
