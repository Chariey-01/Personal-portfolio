from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate
from .cli import cli_bp
from .routes.contact import contact_bp
from .routes.portfolio import portfolio_bp

MIGRATIONS_DIRECTORY = str(Path(__file__).resolve().parents[1] / "migrations")


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db, directory=MIGRATIONS_DIRECTORY)
    CORS(app, origins=app.config["FRONTEND_ORIGINS"])

    app.register_blueprint(portfolio_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(cli_bp)

    @app.before_request
    def require_durable_database():
        error = app.config.get("PERSISTENCE_ERROR")
        if not error or request.path == "/api/health":
            return None
        return jsonify({"error": error}), 503

    @app.get("/api/health")
    def health():
        uri = app.config["SQLALCHEMY_DATABASE_URI"]
        error = app.config.get("PERSISTENCE_ERROR")
        if error and not uri.startswith("postgresql"):
            database = "unavailable"
        elif uri.startswith("postgresql"):
            database = "postgresql"
        elif uri.startswith("sqlite"):
            database = "sqlite"
        else:
            database = "other"
        payload = {
            "status": "degraded" if error else "ok",
            "database": database,
            "storage": app.config.get("STORAGE_BACKEND", "local"),
            "durable": database == "postgresql" and app.config.get("STORAGE_BACKEND") == "database" and not error,
        }
        if error:
            payload["error"] = error
            return payload, 503
        return payload

    return app
