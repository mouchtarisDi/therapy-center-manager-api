from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.membership import Membership, Role
from app.models.user import User


def get_membership(db: Session, *, user_id: int, center_id: int) -> Membership | None:
    return db.execute(
        select(Membership).where(Membership.user_id == user_id, Membership.center_id == center_id)
    ).scalar_one_or_none()


def add_member(
    db: Session,
    *,
    center_id: int,
    user: User,
    role: Role,
) -> Membership:
    existing = get_membership(db, user_id=user.id, center_id=center_id)
    if existing:
        # Αν υπάρχει, ενημερώνουμε role
        existing.role = role
        db.commit()
        db.refresh(existing)
        return existing

    membership = Membership(user_id=user.id, center_id=center_id, role=role)
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership


def list_members(db: Session, *, center_id: int) -> list[Membership]:
    stmt = select(Membership).where(Membership.center_id == center_id).order_by(Membership.created_at.desc())
    return list(db.execute(stmt).scalars().all())
