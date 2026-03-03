"""create core tables

Revision ID: 967d20e84a21
Revises:
Create Date: 2026-03-03
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "967d20e84a21"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- centers ---
    op.create_table(
        "centers",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_centers_name", "centers", ["name"], unique=False)

    # --- users ---
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # --- enum type for role (create once, safely) ---
    role_enum = postgresql.ENUM("OWNER", "ADMIN", "STAFF", name="role_enum")
    role_enum.create(op.get_bind(), checkfirst=True)

    # --- memberships ---
    # IMPORTANT: create_type=False so SQLAlchemy DOES NOT try to CREATE TYPE again
    role_enum_no_create = postgresql.ENUM(
        "OWNER", "ADMIN", "STAFF", name="role_enum", create_type=False
    )

    op.create_table(
        "memberships",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("center_id", sa.Integer(), nullable=False),
        sa.Column("role", role_enum_no_create, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["center_id"], ["centers.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "center_id", name="uq_memberships_user_center"),
    )


def downgrade() -> None:
    op.drop_table("memberships")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.drop_index("ix_centers_name", table_name="centers")
    op.drop_table("centers")

    role_enum = postgresql.ENUM("OWNER", "ADMIN", "STAFF", name="role_enum")
    role_enum.drop(op.get_bind(), checkfirst=True)