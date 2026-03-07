from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.student import Student


def create_student(
    db: Session,
    *,
    center_id: int,
    first_name: str,
    last_name: str,
    amka: str | None = None,
    birth_date=None,
    phone: str | None = None,
    address: str | None = None,
    guardian_full_name: str | None = None,
    guardian_phone: str | None = None,
    guardian_email: str | None = None,
    diagnosis_notes: str | None = None,
    assessment_expiry_date=None,
    approved_sessions: int = 0,
    remaining_sessions: int = 0,
    notes: str | None = None,
) -> Student:
    if amka:
        existing = db.execute(select(Student).where(Student.amka == amka)).scalar_one_or_none()
        if existing:
            raise ValueError("AMKA already exists")

    student = Student(
        center_id=center_id,
        first_name=first_name,
        last_name=last_name,
        amka=amka,
        birth_date=birth_date,
        phone=phone,
        address=address,
        guardian_full_name=guardian_full_name,
        guardian_phone=guardian_phone,
        guardian_email=guardian_email,
        diagnosis_notes=diagnosis_notes,
        assessment_expiry_date=assessment_expiry_date,
        approved_sessions=approved_sessions,
        remaining_sessions=remaining_sessions,
        notes=notes,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_students(
    db: Session,
    center_id: int,
    q: str | None = None,
) -> list[Student]:
    stmt = select(Student).where(Student.center_id == center_id)

    if q:
        like_q = f"%{q}%"
        stmt = stmt.where(
            or_(
                Student.first_name.ilike(like_q),
                Student.last_name.ilike(like_q),
                Student.amka.ilike(like_q),
                Student.guardian_full_name.ilike(like_q),
            )
        )

    stmt = stmt.order_by(Student.last_name.asc(), Student.first_name.asc())
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
    amka: str | None = None,
    birth_date=None,
    phone: str | None = None,
    address: str | None = None,
    guardian_full_name: str | None = None,
    guardian_phone: str | None = None,
    guardian_email: str | None = None,
    diagnosis_notes: str | None = None,
    assessment_expiry_date=None,
    approved_sessions: int | None = None,
    remaining_sessions: int | None = None,
    notes: str | None = None,
) -> Student:
    student = get_student_by_id(db, center_id=center_id, student_id=student_id)
    if not student:
        raise ValueError("Student not found")

    if amka and amka != student.amka:
        existing = db.execute(select(Student).where(Student.amka == amka)).scalar_one_or_none()
        if existing:
            raise ValueError("AMKA already exists")

    if first_name is not None:
        student.first_name = first_name
    if last_name is not None:
        student.last_name = last_name
    if amka is not None:
        student.amka = amka
    if birth_date is not None:
        student.birth_date = birth_date
    if phone is not None:
        student.phone = phone
    if address is not None:
        student.address = address
    if guardian_full_name is not None:
        student.guardian_full_name = guardian_full_name
    if guardian_phone is not None:
        student.guardian_phone = guardian_phone
    if guardian_email is not None:
        student.guardian_email = guardian_email
    if diagnosis_notes is not None:
        student.diagnosis_notes = diagnosis_notes
    if assessment_expiry_date is not None:
        student.assessment_expiry_date = assessment_expiry_date
    if approved_sessions is not None:
        student.approved_sessions = approved_sessions
    if remaining_sessions is not None:
        student.remaining_sessions = remaining_sessions
    if notes is not None:
        student.notes = notes

    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, *, center_id: int, student_id: int) -> None:
    student = get_student_by_id(db, center_id=center_id, student_id=student_id)
    if not student:
        raise ValueError("Student not found")

    db.delete(student)
    db.commit()