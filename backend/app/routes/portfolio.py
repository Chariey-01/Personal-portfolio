from flask import Blueprint

portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.get("/projects")
def projects():
    return {
        "source": "frontend/src/data/profile.ts",
        "message": "Public project data is currently bundled with the frontend for fast static hosting.",
    }


@portfolio_bp.get("/skills")
def skills():
    return {
        "source": "frontend/src/data/profile.ts",
        "message": "Public skill data is currently bundled with the frontend for fast static hosting.",
    }
