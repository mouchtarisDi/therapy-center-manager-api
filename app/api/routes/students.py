from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.student import StudentCreate, StudentOut
from app.services.student_service import create_student, get_students
from app.api.deps import get_current_center, require_center_roles
from app.models.membership import Role

router = APIRouter(prefix="/students", tags=["students"])


@router.post("/", response_model=StudentOut)
def create_student_endpoint(
    payload: StudentCreate,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    return create_student(db, center.id, payload.first_name, payload.last_name)


@router.get("/", response_model=list[StudentOut])
def list_students(
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    return get_students(db, center.id)