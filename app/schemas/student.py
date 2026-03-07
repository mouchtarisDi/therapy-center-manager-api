from pydantic import BaseModel


class StudentCreate(BaseModel):
    first_name: str
    last_name: str

class StudentUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None

class StudentOut(BaseModel):
    id: int
    first_name: str
    last_name: str

    model_config = {"from_attributes": True}