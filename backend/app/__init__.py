from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate
from .cli import cli_bp
from .routes.contact import contact_bp
from .routes.portfolio import portfolio_bp


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config["FRONTEND_ORIGINS"])

    app.register_blueprint(portfolio_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(cli_bp)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
