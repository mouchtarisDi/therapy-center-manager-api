from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Role(str, Enum):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    STAFF = "STAFF"


class Membership(Base):
    __tablename__ = "memberships"

    __table_args__ = (
        UniqueConstraint("user_id", "center_id", name="uq_memberships_user_center"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    center_id: Mapped[int] = mapped_column(ForeignKey("centers.id", ondelete="CASCADE"), nullable=False)

    role: Mapped[Role] = mapped_column(SAEnum(Role, name="role_enum"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="memberships")
    center = relationship("Center", back_populates="memberships")