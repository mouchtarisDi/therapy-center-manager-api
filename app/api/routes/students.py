from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_center, require_center_roles
from app.db.session import get_db
from app.models.membership import Role
from app.schemas.student import StudentCreate, StudentOut, StudentUpdate
from app.services.student_service import (
    create_student,
    delete_student,
    get_student_by_id,
    get_students,
    update_student,
)

router = APIRouter(prefix="/students", tags=["students"])


@router.post("/", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student_endpoint(
    payload: StudentCreate,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    return create_student(
        db,
        center.id,
        payload.first_name,
        payload.last_name,
    )


@router.get("/", response_model=list[StudentOut])
def list_students(
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    return get_students(db, center.id)


@router.get("/{student_id}", response_model=StudentOut)
def get_student_endpoint(
    student_id: int,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    student = get_student_by_id(db, center_id=center.id, student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.patch("/{student_id}", response_model=StudentOut)
def update_student_endpoint(
    student_id: int,
    payload: StudentUpdate,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    try:
        return update_student(
            db,
            center_id=center.id,
            student_id=student_id,
            first_name=payload.first_name,
            last_name=payload.last_name,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student_endpoint(
    student_id: int,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN)),
    db: Session = Depends(get_db),
):
    try:
        delete_student(db, center_id=center.id, student_id=student_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))