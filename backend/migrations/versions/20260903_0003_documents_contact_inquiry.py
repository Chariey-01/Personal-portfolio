"""add reusable documents and contact inquiry metadata

Revision ID: 20260903_0003
Revises: 20260903_0002
Create Date: 2026-09-03
"""

from alembic import op
import sqlalchemy as sa


revision = "20260903_0003"
down_revision = "20260903_0002"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "contact_message",
        sa.Column("inquiry_type", sa.String(length=80), server_default="Other", nullable=False),
    )
    op.add_column(
        "contact_message",
        sa.Column("archived", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.create_table(
        "document",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("document_type", sa.String(length=40), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("storage_url", sa.String(length=500), nullable=False),
        sa.Column("storage_key", sa.String(length=500), nullable=False),
        sa.Column("download_label", sa.String(length=120), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_current", sa.Boolean(), nullable=False),
        sa.Column("is_public", sa.Boolean(), nullable=False),
        sa.Column("archived", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_document_document_type"), "document", ["document_type"], unique=False)
    op.create_index(op.f("ix_document_is_current"), "document", ["is_current"], unique=False)


def downgrade():
    op.drop_index(op.f("ix_document_is_current"), table_name="document")
    op.drop_index(op.f("ix_document_document_type"), table_name="document")
    op.drop_table("document")
    op.drop_column("contact_message", "archived")
    op.drop_column("contact_message", "inquiry_type")
