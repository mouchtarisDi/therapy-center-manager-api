from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.student import Student


def create_payment(
    db: Session,
    *,
    center_id: int,
    student_id: int,
    amount: float,
    method: str,
    notes: str | None,
) -> Payment:
    student = db.get(Student, student_id)

    if not student or student.center_id != center_id:
        raise ValueError("Student not found in this center")

    payment = Payment(
        center_id=center_id,
        student_id=student_id,
        amount=amount,
        method=method,
        payment_date=datetime.now(timezone.utc),
        notes=notes,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def list_payments(
    db: Session,
    *,
    center_id: int,
    student_id: int | None = None,
    method: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
) -> list[Payment]:
    stmt = select(Payment).where(Payment.center_id == center_id)

    if student_id is not None:
        stmt = stmt.where(Payment.student_id == student_id)

    if method is not None:
        stmt = stmt.where(Payment.method == method)

    if date_from is not None:
        stmt = stmt.where(Payment.payment_date >= date_from)

    if date_to is not None:
        stmt = stmt.where(Payment.payment_date <= date_to)

    if min_amount is not None:
        stmt = stmt.where(Payment.amount >= min_amount)

    if max_amount is not None:
        stmt = stmt.where(Payment.amount <= max_amount)

    stmt = stmt.order_by(Payment.payment_date.desc())

    return list(db.execute(stmt).scalars().all())


def get_payment_by_id(db: Session, *, center_id: int, payment_id: int) -> Payment | None:
    stmt = select(Payment).where(
        Payment.id == payment_id,
        Payment.center_id == center_id,
    )
    return db.execute(stmt).scalar_one_or_none()


def update_payment(
    db: Session,
    *,
    center_id: int,
    payment_id: int,
    amount: float | None = None,
    method: str | None = None,
    notes: str | None = None,
) -> Payment:
    payment = get_payment_by_id(db, center_id=center_id, payment_id=payment_id)
    if not payment:
        raise ValueError("Payment not found")

    if amount is not None:
        payment.amount = amount

    if method is not None:
        payment.method = method

    if notes is not None:
        payment.notes = notes

    db.commit()
    db.refresh(payment)
    return payment


def delete_payment(db: Session, *, payment_id: int, center_id: int) -> None:
    payment = get_payment_by_id(db, center_id=center_id, payment_id=payment_id)

    if not payment:
        raise ValueError("Payment not found")

    db.delete(payment)
    db.commit()