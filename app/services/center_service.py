from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.center import Center
from app.models.membership import Membership, Role
from app.models.user import User


def create_center(db: Session, *, name: str, owner: User) -> Center:
    center = Center(name=name)
    db.add(center)
    db.flush()  # παίρνουμε center.id πριν το commit

    membership = Membership(user_id=owner.id, center_id=center.id, role=Role.OWNER)
    db.add(membership)

    db.commit()
    db.refresh(center)
    return center


def list_centers_for_user(db: Session, *, user: User) -> list[Center]:
    # centers που έχει membership
    stmt = (
        select(Center)
        .join(Membership, Membership.center_id == Center.id)
        .where(Membership.user_id == user.id)
        .order_by(Center.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())
