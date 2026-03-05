from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_center, get_current_user, require_center_roles
from app.db.session import get_db
from app.models.center import Center
from app.models.membership import Role
from app.models.user import User
from app.schemas.center import CenterCreate, CenterOut
from app.services.center_service import create_center, list_centers_for_user


router = APIRouter(prefix="/centers", tags=["centers"])


@router.post("/", response_model=CenterOut, status_code=201)
def create_center_endpoint(
    payload: CenterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_center(db, name=payload.name, owner=current_user)


@router.get("/", response_model=list[CenterOut])
def list_my_centers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_centers_for_user(db, user=current_user)


@router.get("/current", response_model=CenterOut)
def get_current_center_endpoint(
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
):
    # Επιστρέφει το center που δείχνει το X-Center-Id
    return center
