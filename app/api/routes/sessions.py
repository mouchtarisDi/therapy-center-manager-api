from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_center, require_center_roles
from app.db.session import get_db
from app.models.center import Center
from app.models.membership import Role
from app.schemas.session import SessionCreate, SessionOut, SessionUpdate
from app.services.session_service import (
    create_session,
    delete_session,
    list_sessions,
    update_session,
)

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/", response_model=SessionOut, status_code=201)
def create_session_endpoint(
    payload: SessionCreate,
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    try:
        return create_session(
            db,
            center_id=center.id,
            student_id=payload.student_id,
            therapist_user_id=payload.therapist_user_id,
            scheduled_at=payload.scheduled_at,
            notes=payload.notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[SessionOut])
def list_sessions_endpoint(
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    student_id: int | None = Query(default=None),
    status_value: str | None = Query(default=None, alias="status"),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    db: Session = Depends(get_db),
):
    try:
        return list_sessions(
            db,
            center_id=center.id,
            student_id=student_id,
            status=status_value,
            date_from=date_from,
            date_to=date_to,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{session_id}", response_model=SessionOut)
def update_session_endpoint(
    session_id: int,
    payload: SessionUpdate,
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    try:
        return update_session(
            db,
            center_id=center.id,
            session_id=session_id,
            therapist_user_id=payload.therapist_user_id,
            scheduled_at=payload.scheduled_at,
            status=payload.status,
            notes=payload.notes,
        )
    except ValueError as e:
        message = str(e)
        if message == "Session not found":
            raise HTTPException(status_code=404, detail=message)
        raise HTTPException(status_code=400, detail=message)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session_endpoint(
    session_id: int,
    center: Center = Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN)),
    db: Session = Depends(get_db),
):
    try:
        delete_session(db, center_id=center.id, session_id=session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))