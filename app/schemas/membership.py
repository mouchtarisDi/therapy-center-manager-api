from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr


RoleLiteral = Literal["OWNER", "ADMIN", "STAFF"]


class MembershipCreate(BaseModel):
    user_email: EmailStr
    role: RoleLiteral


class MembershipOut(BaseModel):
    id: int
    user_id: int
    center_id: int
    role: RoleLiteral
    created_at: datetime

    model_config = {"from_attributes": True}
