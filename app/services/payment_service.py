from datetime import datetime

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
        payment_date=datetime.utcnow(),
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
) -> list[Payment]:

    stmt = select(Payment).where(Payment.center_id == center_id)

    if student_id is not None:
        stmt = stmt.where(Payment.student_id == student_id)

    stmt = stmt.order_by(Payment.payment_date.desc())

    return list(db.execute(stmt).scalars().all())


def delete_payment(db: Session, *, payment_id: int, center_id: int):

    payment = db.get(Payment, payment_id)

    if not payment or payment.center_id != center_id:
        raise ValueError("Payment not found")

    db.delete(payment)
    db.commit()