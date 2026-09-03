import click
from flask import Blueprint

from .extensions import db

cli_bp = Blueprint("cli", __name__)


@cli_bp.cli.command("init-db")
def init_db():
    """Create local development database tables."""
    db.create_all()
    click.echo("Database tables created.")
