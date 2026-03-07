from datetime import date

from pydantic import BaseModel, EmailStr, Field


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    amka: str | None = Field(default=None, min_length=11, max_length=11)
    birth_date: date | None = None
    phone: str | None = None
    address: str | None = None

    guardian_full_name: str | None = None
    guardian_phone: str | None = None
    guardian_email: EmailStr | None = None

    diagnosis_notes: str | None = None
    assessment_expiry_date: date | None = None

    approved_sessions: int = Field(default=0, ge=0)
    remaining_sessions: int = Field(default=0, ge=0)

    notes: str | None = None


class StudentUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    amka: str | None = Field(default=None, min_length=11, max_length=11)
    birth_date: date | None = None
    phone: str | None = None
    address: str | None = None

    guardian_full_name: str | None = None
    guardian_phone: str | None = None
    guardian_email: EmailStr | None = None

    diagnosis_notes: str | None = None
    assessment_expiry_date: date | None = None

    approved_sessions: int | None = Field(default=None, ge=0)
    remaining_sessions: int | None = Field(default=None, ge=0)

    notes: str | None = None


class StudentOut(BaseModel):
    id: int
    center_id: int
    first_name: str
    last_name: str
    amka: str | None
    birth_date: date | None
    phone: str | None
    address: str | None

    guardian_full_name: str | None
    guardian_phone: str | None
    guardian_email: EmailStr | None

    diagnosis_notes: str | None
    assessment_expiry_date: date | None

    approved_sessions: int
    remaining_sessions: int
    notes: str | None

    model_config = {"from_attributes": True}