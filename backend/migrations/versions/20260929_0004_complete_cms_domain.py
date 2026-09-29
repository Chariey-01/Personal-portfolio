"""complete portfolio cms domain

Revision ID: 20260929_0004
Revises: 20260903_0003
Create Date: 2026-09-29
"""

from alembic import op
import sqlalchemy as sa


revision = "20260929_0004"
down_revision = "20260903_0003"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("contact_message", sa.Column("handled", sa.Boolean(), server_default=sa.false(), nullable=False))
    op.add_column("project", sa.Column("long_description", sa.Text(), nullable=True))
    op.add_column("project", sa.Column("solution", sa.Text(), nullable=True))
    op.add_column("project", sa.Column("technical_decisions", sa.JSON(), server_default="[]", nullable=False))
    op.add_column("project", sa.Column("lessons", sa.JSON(), server_default="[]", nullable=False))
    op.add_column("project", sa.Column("result", sa.Text(), nullable=True))
    op.add_column("project", sa.Column("year", sa.Integer(), nullable=True))
    op.add_column("project", sa.Column("published", sa.Boolean(), server_default=sa.true(), nullable=False))
    op.add_column("project", sa.Column("accent_from", sa.String(length=20), nullable=True))
    op.add_column("project", sa.Column("accent_to", sa.String(length=20), nullable=True))

    op.create_table(
        "project_image",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.String(length=500), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=False),
        sa.Column("caption", sa.String(length=255), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["project.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_project_image_project_id"), "project_image", ["project_id"], unique=False)
    op.create_table(
        "skill",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("detail", sa.String(length=255), nullable=False),
        sa.Column("familiarity", sa.String(length=40), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_skill_category"), "skill", ["category"], unique=False)
    op.create_table(
        "experience",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("label", sa.String(length=100), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("organization", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("start_date", sa.String(length=40), nullable=True),
        sa.Column("end_date", sa.String(length=40), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "education",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("institution", sa.String(length=160), nullable=False),
        sa.Column("program", sa.String(length=180), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("start_date", sa.String(length=40), nullable=True),
        sa.Column("end_date", sa.String(length=40), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "social_link",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("label", sa.String(length=80), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("social_link")
    op.drop_table("education")
    op.drop_table("experience")
    op.drop_index(op.f("ix_skill_category"), table_name="skill")
    op.drop_table("skill")
    op.drop_index(op.f("ix_project_image_project_id"), table_name="project_image")
    op.drop_table("project_image")
    op.drop_column("project", "accent_to")
    op.drop_column("project", "accent_from")
    op.drop_column("project", "published")
    op.drop_column("project", "year")
    op.drop_column("project", "result")
    op.drop_column("project", "lessons")
    op.drop_column("project", "technical_decisions")
    op.drop_column("project", "solution")
    op.drop_column("project", "long_description")
    op.drop_column("contact_message", "handled")
