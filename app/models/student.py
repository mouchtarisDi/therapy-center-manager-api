from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    center = relationship("Center")