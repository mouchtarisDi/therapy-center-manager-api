from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.membership import Membership
from app.models.session import TherapySession, SessionStatus
from app.models.student import Student
from app.models.user import User


def create_session(
    db: Session,
    *,
    center_id: int,
    student_id: int,
    therapist_user_id: int | None,
    scheduled_at: datetime,
    notes: str | None,
) -> TherapySession:
    student = db.get(Student, student_id)
    if not student or student.center_id != center_id:
        raise ValueError("Student not found in this center")

    if therapist_user_id is not None:
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

    session = TherapySession(
        center_id=center_id,
        student_id=student_id,
        therapist_user_id=therapist_user_id,
        scheduled_at=scheduled_at,
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
    status: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> list[TherapySession]:
    stmt = select(TherapySession).where(TherapySession.center_id == center_id)

    if student_id is not None:
        stmt = stmt.where(TherapySession.student_id == student_id)

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
    status: str | None = None,
    notes: str | None = None,
) -> TherapySession:
    session = get_session_by_id(db, center_id=center_id, session_id=session_id)
    if not session:
        raise ValueError("Session not found")

    if therapist_user_id is not None:
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

        session.therapist_user_id = therapist_user_id

    if scheduled_at is not None:
        session.scheduled_at = scheduled_at

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