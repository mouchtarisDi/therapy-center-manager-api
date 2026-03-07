from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.student import Student


def create_student(db: Session, center_id: int, first_name: str, last_name: str) -> Student:
    student = Student(
        center_id=center_id,
        first_name=first_name,
        last_name=last_name,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_students(db: Session, center_id: int) -> list[Student]:
    stmt = (
        select(Student)
        .where(Student.center_id == center_id)
        .order_by(Student.last_name.asc(), Student.first_name.asc())
    )
    return list(db.execute(stmt).scalars().all())


def get_student_by_id(db: Session, *, center_id: int, student_id: int) -> Student | None:
    stmt = select(Student).where(
        Student.id == student_id,
        Student.center_id == center_id,
    )
    return db.execute(stmt).scalar_one_or_none()


def update_student(
    db: Session,
    *,
    center_id: int,
    student_id: int,
    first_name: str | None = None,
    last_name: str | None = None,
) -> Student:
    student = get_student_by_id(db, center_id=center_id, student_id=student_id)
    if not student:
        raise ValueError("Student not found")

    if first_name is not None:
        student.first_name = first_name

    if last_name is not None:
        student.last_name = last_name

    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, *, center_id: int, student_id: int) -> None:
    student = get_student_by_id(db, center_id=center_id, student_id=student_id)
    if not student:
        raise ValueError("Student not found")

    db.delete(student)
    db.commit()