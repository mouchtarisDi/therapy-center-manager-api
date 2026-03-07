from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_center, require_center_roles
from app.db.session import get_db
from app.models.membership import Role
from app.schemas.payment import PaymentCreate, PaymentOut, PaymentUpdate
from app.services.payment_service import (
    create_payment,
    delete_payment,
    get_payment_by_id,
    list_payments,
    update_payment,
)

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def create_payment_endpoint(
    payload: PaymentCreate,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    try:
        return create_payment(
            db,
            center_id=center.id,
            student_id=payload.student_id,
            amount=payload.amount,
            method=payload.method,
            notes=payload.notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[PaymentOut])
def list_payments_endpoint(
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    return list_payments(db, center_id=center.id)


@router.get("/{payment_id}", response_model=PaymentOut)
def get_payment_endpoint(
    payment_id: int,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    payment = get_payment_by_id(db, center_id=center.id, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.patch("/{payment_id}", response_model=PaymentOut)
def update_payment_endpoint(
    payment_id: int,
    payload: PaymentUpdate,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN, Role.STAFF)),
    db: Session = Depends(get_db),
):
    try:
        return update_payment(
            db,
            center_id=center.id,
            payment_id=payment_id,
            amount=payload.amount,
            method=payload.method,
            notes=payload.notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_endpoint(
    payment_id: int,
    center=Depends(get_current_center),
    _m=Depends(require_center_roles(Role.OWNER, Role.ADMIN)),
    db: Session = Depends(get_db),
):
    try:
        delete_payment(db, payment_id=payment_id, center_id=center.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))