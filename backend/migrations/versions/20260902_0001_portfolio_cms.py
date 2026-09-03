"""create portfolio cms tables

Revision ID: 20260902_0001
Revises:
Create Date: 2026-09-02
"""

from alembic import op
import sqlalchemy as sa


revision = "20260902_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "contact_message",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "profile",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("alias", sa.String(length=80), nullable=True),
        sa.Column("location", sa.String(length=120), nullable=True),
        sa.Column("role", sa.String(length=160), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("headline", sa.String(length=255), nullable=False),
        sa.Column("bio", sa.Text(), nullable=False),
        sa.Column("story", sa.Text(), nullable=False),
        sa.Column("profile_image_url", sa.String(length=500), nullable=True),
        sa.Column("profile_image_alt", sa.String(length=255), nullable=True),
        sa.Column("availability", sa.String(length=160), nullable=True),
        sa.Column("links", sa.JSON(), nullable=False),
        sa.Column("focus_stack", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "project",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=180), nullable=False),
        sa.Column("short_description", sa.Text(), nullable=False),
        sa.Column("case_study", sa.Text(), nullable=True),
        sa.Column("role", sa.String(length=180), nullable=True),
        sa.Column("technologies", sa.JSON(), nullable=False),
        sa.Column("github_url", sa.String(length=500), nullable=True),
        sa.Column("live_url", sa.String(length=500), nullable=True),
        sa.Column("image_url", sa.String(length=500), nullable=True),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("problem", sa.Text(), nullable=True),
        sa.Column("architecture", sa.JSON(), nullable=False),
        sa.Column("highlights", sa.JSON(), nullable=False),
        sa.Column("technical_challenges", sa.JSON(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_project_slug"), "project", ["slug"], unique=True)
    op.create_table(
        "resume",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("storage_url", sa.String(length=500), nullable=False),
        sa.Column("storage_key", sa.String(length=500), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_current", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_resume_is_current"), "resume", ["is_current"], unique=False)
    op.create_table(
        "testimonial",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("person_name", sa.String(length=160), nullable=False),
        sa.Column("role", sa.String(length=160), nullable=True),
        sa.Column("organization", sa.String(length=160), nullable=True),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("image_url", sa.String(length=500), nullable=True),
        sa.Column("profile_url", sa.String(length=500), nullable=True),
        sa.Column("approved", sa.Boolean(), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("testimonial")
    op.drop_index(op.f("ix_resume_is_current"), table_name="resume")
    op.drop_table("resume")
    op.drop_index(op.f("ix_project_slug"), table_name="project")
    op.drop_table("project")
    op.drop_table("profile")
    op.drop_table("contact_message")
