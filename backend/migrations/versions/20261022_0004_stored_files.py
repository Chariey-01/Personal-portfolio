"""store uploaded files in the database

Revision ID: 20261022_0004
Revises: 20260903_0003
Create Date: 2026-10-22
"""

from alembic import op
import sqlalchemy as sa


revision = "20261022_0004"
down_revision = "20260903_0003"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "stored_file",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("storage_key", sa.String(length=500), nullable=False),
        sa.Column("content_type", sa.String(length=120), nullable=False),
        sa.Column("data", sa.LargeBinary(), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_stored_file_storage_key"), "stored_file", ["storage_key"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_stored_file_storage_key"), table_name="stored_file")
    op.drop_table("stored_file")
