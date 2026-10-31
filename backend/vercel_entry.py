"""Vercel service entry for the Flask portfolio API.

Public requests under /api reach this service with their original path.
Flask routes are already mounted at /api. The prefix middleware also accepts
a path that arrives without that prefix.
"""

import os

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
