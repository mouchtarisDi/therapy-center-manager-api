from datetime import datetime
from typing import Literal
from pydantic import Field

from pydantic import BaseModel


SessionStatusLiteral = Literal["SCHEDULED", "COMPLETED", "CANCELLED"]


class SessionCreate(BaseModel):
    student_id: int
    therapist_user_id: int | None = None
    scheduled_at: datetime
    duration_minutes: int = Field(default=60, ge=15, le=240)
    notes: str | None = None


class SessionUpdate(BaseModel):
    therapist_user_id: int | None = None
    scheduled_at: datetime | None = None
    duration_minutes: int | None = Field(default=None, ge=15, le=240)
    status: SessionStatusLiteral | None = None
    notes: str | None = None


class SessionOut(BaseModel):
    id: int
    center_id: int
    student_id: int
    therapist_user_id: int | None
    scheduled_at: datetime
    status: SessionStatusLiteral
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}