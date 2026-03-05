from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_center, get_current_user, require_center_roles
from app.db.session import get_db
from app.models.center import Center
from app.models.membership import Role
from app.models.user import User
from app.schemas.membership import MembershipCreate, MembershipOut
from app.services.membership_service import add_member, list_members
from app.services.user_service import get_user_by_email


router = APIRouter(prefix="/memberships", tags=["memberships"])


@router.get("/", response_model=list[MembershipOut])
def list_center_memberships(
    db: Session = Depends(get_db),
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN)),
):
    return list_members(db, center_id=center.id)


@router.post("/", response_model=MembershipOut, status_code=201)
def add_member_endpoint(
    payload: MembershipCreate,
    db: Session = Depends(get_db),
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN)),
):
    user = get_user_by_email(db, payload.user_email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Ο χρήστης δεν βρέθηκε. Ζήτα του να κάνει register πρώτα.",
        )

    try:
        role = Role(payload.role)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role")

    return add_member(db, center_id=center.id, user=user, role=role)
