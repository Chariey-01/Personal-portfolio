"""Vercel Python entry for the existing Flask portfolio API.

Same-origin `/api/*` requests reach this module. PostgreSQL is required.
This entry does not create a temporary SQLite database, and uploads are
stored in that database instead of the serverless filesystem.
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
for path in (BACKEND, ROOT):
    if path not in sys.path:
        sys.path.insert(0, path)

if os.environ.get("DATABASE_URL", "").startswith("postgres"):
    os.environ["STORAGE_BACKEND"] = "database"

from app.services.persistence import prepare_production_database
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
app.config["PERSISTENCE_ERROR"] = prepare_production_database(app)
