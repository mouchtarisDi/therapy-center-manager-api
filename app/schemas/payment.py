from datetime import datetime
from typing import Literal

from pydantic import BaseModel


PaymentMethodLiteral = Literal["CASH", "CARD", "BANK_TRANSFER"]


class PaymentCreate(BaseModel):
    student_id: int
    amount: float
    method: PaymentMethodLiteral
    notes: str | None = None


class PaymentUpdate(BaseModel):
    amount: float | None = None
    method: PaymentMethodLiteral | None = None
    notes: str | None = None


class PaymentOut(BaseModel):
    id: int
    center_id: int
    student_id: int
    amount: float
    method: PaymentMethodLiteral
    payment_date: datetime
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}