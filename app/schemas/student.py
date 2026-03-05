from pydantic import BaseModel


class StudentCreate(BaseModel):
    first_name: str
    last_name: str


class StudentOut(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        from_attributes = True