"""add current cover letter uploads

Revision ID: 20260903_0002
Revises: 20260902_0001
Create Date: 2026-09-03
"""

from alembic import op
import sqlalchemy as sa


revision = "20260903_0002"
down_revision = "20260902_0001"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "cover_letter",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("storage_url", sa.String(length=500), nullable=False),
        sa.Column("storage_key", sa.String(length=500), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_current", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_cover_letter_is_current"), "cover_letter", ["is_current"], unique=False)


def downgrade():
    op.drop_index(op.f("ix_cover_letter_is_current"), table_name="cover_letter")
    op.drop_table("cover_letter")
