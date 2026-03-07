from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.membership import Membership
from app.models.session import TherapySession, SessionStatus
from app.models.student import Student
from app.models.user import User


def _session_end(start: datetime, duration_minutes: int) -> datetime:
    return start + timedelta(minutes=duration_minutes)


def _has_time_overlap(
    existing_start: datetime,
    existing_duration: int,
    new_start: datetime,
    new_duration: int,
) -> bool:
    existing_end = _session_end(existing_start, existing_duration)
    new_end = _session_end(new_start, new_duration)

    return new_start < existing_end and existing_start < new_end


def _validate_therapist_in_center(
    db: Session,
    *,
    center_id: int,
    therapist_user_id: int | None,
) -> None:
    if therapist_user_id is None:
        return

    therapist = db.get(User, therapist_user_id)
    if not therapist:
        raise ValueError("Therapist user not found")

    therapist_membership = db.execute(
        select(Membership).where(
            Membership.user_id == therapist_user_id,
            Membership.center_id == center_id,
        )
    ).scalar_one_or_none()

    if not therapist_membership:
        raise ValueError("Therapist user does not belong to this center")


def _validate_student_in_center(
    db: Session,
    *,
    center_id: int,
    student_id: int,
) -> Student:
    student = db.get(Student, student_id)
    if not student or student.center_id != center_id:
        raise ValueError("Student not found in this center")
    return student


def _check_student_conflicts(
    db: Session,
    *,
    center_id: int,
    student_id: int,
    scheduled_at: datetime,
    duration_minutes: int,
    exclude_session_id: int | None = None,
) -> None:
    stmt = select(TherapySession).where(
        TherapySession.center_id == center_id,
        TherapySession.student_id == student_id,
        TherapySession.status != SessionStatus.CANCELLED,
    )

    if exclude_session_id is not None:
        stmt = stmt.where(TherapySession.id != exclude_session_id)

    sessions = db.execute(stmt).scalars().all()

    for existing in sessions:
        if _has_time_overlap(
            existing.scheduled_at,
            existing.duration_minutes,
            scheduled_at,
            duration_minutes,
        ):
            raise ValueError("Student already has another session in this time range")


def _check_therapist_conflicts(
    db: Session,
    *,
    center_id: int,
    therapist_user_id: int | None,
    scheduled_at: datetime,
    duration_minutes: int,
    exclude_session_id: int | None = None,
) -> None:
    if therapist_user_id is None:
        return

    stmt = select(TherapySession).where(
        TherapySession.center_id == center_id,
        TherapySession.therapist_user_id == therapist_user_id,
        TherapySession.status != SessionStatus.CANCELLED,
    )

    if exclude_session_id is not None:
        stmt = stmt.where(TherapySession.id != exclude_session_id)

    sessions = db.execute(stmt).scalars().all()

    for existing in sessions:
        if _has_time_overlap(
            existing.scheduled_at,
            existing.duration_minutes,
            scheduled_at,
            duration_minutes,
        ):
            raise ValueError("Therapist already has another session in this time range")


def create_session(
    db: Session,
    *,
    center_id: int,
    student_id: int,
    therapist_user_id: int | None,
    scheduled_at: datetime,
    duration_minutes: int,
    notes: str | None,
) -> TherapySession:
    _validate_student_in_center(
        db,
        center_id=center_id,
        student_id=student_id,
    )

    _validate_therapist_in_center(
        db,
        center_id=center_id,
        therapist_user_id=therapist_user_id,
    )

    _check_student_conflicts(
        db,
        center_id=center_id,
        student_id=student_id,
        scheduled_at=scheduled_at,
        duration_minutes=duration_minutes,
    )

    _check_therapist_conflicts(
        db,
        center_id=center_id,
        therapist_user_id=therapist_user_id,
        scheduled_at=scheduled_at,
        duration_minutes=duration_minutes,
    )

    session = TherapySession(
        center_id=center_id,
        student_id=student_id,
        therapist_user_id=therapist_user_id,
        scheduled_at=scheduled_at,
        duration_minutes=duration_minutes,
        status=SessionStatus.SCHEDULED,
        notes=notes,
    )

    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def list_sessions(
    db: Session,
    *,
    center_id: int,
    student_id: int | None = None,
    therapist_user_id: int | None = None,
    status: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> list[TherapySession]:
    stmt = select(TherapySession).where(TherapySession.center_id == center_id)

    if student_id is not None:
        stmt = stmt.where(TherapySession.student_id == student_id)

    if therapist_user_id is not None:
        stmt = stmt.where(TherapySession.therapist_user_id == therapist_user_id)

    if status is not None:
        stmt = stmt.where(TherapySession.status == status)

    if date_from is not None:
        stmt = stmt.where(TherapySession.scheduled_at >= date_from)

    if date_to is not None:
        stmt = stmt.where(TherapySession.scheduled_at <= date_to)

    stmt = stmt.order_by(TherapySession.scheduled_at.asc())

    return list(db.execute(stmt).scalars().all())


def get_session_by_id(db: Session, *, center_id: int, session_id: int) -> TherapySession | None:
    return db.execute(
        select(TherapySession).where(
            TherapySession.id == session_id,
            TherapySession.center_id == center_id,
        )
    ).scalar_one_or_none()


def update_session(
    db: Session,
    *,
    center_id: int,
    session_id: int,
    therapist_user_id: int | None = None,
    scheduled_at: datetime | None = None,
    duration_minutes: int | None = None,
    status: str | None = None,
    notes: str | None = None,
) -> TherapySession:
    session = get_session_by_id(db, center_id=center_id, session_id=session_id)
    if not session:
        raise ValueError("Session not found")

    new_therapist_user_id = therapist_user_id if therapist_user_id is not None else session.therapist_user_id
    new_scheduled_at = scheduled_at if scheduled_at is not None else session.scheduled_at
    new_duration_minutes = duration_minutes if duration_minutes is not None else session.duration_minutes

    _validate_therapist_in_center(
        db,
        center_id=center_id,
        therapist_user_id=new_therapist_user_id,
    )

    if status != "CANCELLED":
        _check_student_conflicts(
            db,
            center_id=center_id,
            student_id=session.student_id,
            scheduled_at=new_scheduled_at,
            duration_minutes=new_duration_minutes,
            exclude_session_id=session.id,
        )

        _check_therapist_conflicts(
            db,
            center_id=center_id,
            therapist_user_id=new_therapist_user_id,
            scheduled_at=new_scheduled_at,
            duration_minutes=new_duration_minutes,
            exclude_session_id=session.id,
        )

    session.therapist_user_id = new_therapist_user_id
    session.scheduled_at = new_scheduled_at
    session.duration_minutes = new_duration_minutes

    if status is not None:
        session.status = SessionStatus(status)

    if notes is not None:
        session.notes = notes

    db.commit()
    db.refresh(session)
    return session


def delete_session(db: Session, *, center_id: int, session_id: int) -> None:
    session = get_session_by_id(db, center_id=center_id, session_id=session_id)
    if not session:
        raise ValueError("Session not found")

    db.delete(session)
    db.commit()


def therapist_has_conflict(
    db: Session,
    *,
    center_id: int,
    therapist_user_id: int,
    scheduled_at: datetime,
    duration_minutes: int,
) -> bool:
    stmt = select(TherapySession).where(
        TherapySession.center_id == center_id,
        TherapySession.therapist_user_id == therapist_user_id,
        TherapySession.status != SessionStatus.CANCELLED,
    )

    sessions = db.execute(stmt).scalars().all()

    for existing in sessions:
        if _has_time_overlap(
            existing.scheduled_at,
            existing.duration_minutes,
            scheduled_at,
            duration_minutes,
        ):
            return True

    return False