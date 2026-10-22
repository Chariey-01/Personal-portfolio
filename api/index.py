"""Vercel Python entry for the existing Flask portfolio API.

The production frontend is a static Vite build. Same-origin `/api/*` requests
reach this module. SQLite on `/tmp` is used only when DATABASE_URL is unset;
that database does not survive a new instance. Set DATABASE_URL for durable
storage.
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
for path in (BACKEND, ROOT):
    if path not in sys.path:
        sys.path.insert(0, path)

os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/portfolio.db")

from app.extensions import db
from app.services.cms import ensure_default_content
from wsgi import app


class ApiPrefixMiddleware:
    """Accept both `/api/projects` and a stripped `/projects` path."""

    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path = environ.get("PATH_INFO") or "/"
        if path != "/api" and not path.startswith("/api/"):
            suffix = "" if path == "/" else path
            environ["PATH_INFO"] = f"/api{suffix}"
        return self.wsgi_app(environ, start_response)


app.wsgi_app = ApiPrefixMiddleware(app.wsgi_app)


def prepare_database() -> None:
    uri = app.config["SQLALCHEMY_DATABASE_URI"]
    with app.app_context():
        if uri.startswith("sqlite"):
            db.create_all()
        ensure_default_content()


prepare_database()
