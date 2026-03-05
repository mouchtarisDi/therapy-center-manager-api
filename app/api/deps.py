from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.center import Center
from app.models.membership import Membership, Role
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user_id = int(sub)
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user


def get_current_center_id(x_center_id: int | None = Header(default=None, alias="X-Center-Id")) -> int:
    """Center context for multi-tenant routes.

    Client should send: X-Center-Id: <center_id>
    """
    if x_center_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Λείπει το X-Center-Id header.",
        )
    return int(x_center_id)


def get_current_center(
    db: Session = Depends(get_db),
    center_id: int = Depends(get_current_center_id),
) -> Center:
    center = db.get(Center, center_id)
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")
    return center


def get_current_membership(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    center_id: int = Depends(get_current_center_id),
) -> Membership:
    membership = db.execute(
        select(Membership).where(
            Membership.user_id == current_user.id,
            Membership.center_id == center_id,
        )
    ).scalar_one_or_none()
    if not membership:
        raise HTTPException(status_code=403, detail="Δεν έχεις πρόσβαση σε αυτό το κέντρο.")
    return membership


def require_center_roles(*allowed_roles: Role):
    """RBAC per center.

    Usage:
      def endpoint(m=Depends(require_center_roles(Role.OWNER, Role.ADMIN))):
          ...
    """

    def _dep(membership: Membership = Depends(get_current_membership)) -> Membership:
        if membership.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Δεν έχεις δικαίωμα για αυτή την ενέργεια.")
        return membership

    return _dep