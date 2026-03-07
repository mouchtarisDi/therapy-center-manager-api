from datetime import date

from sqlalchemy import Column, Date, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    center_id = Column(Integer, ForeignKey("centers.id"), nullable=False, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    amka = Column(String(11), unique=True, nullable=True, index=True)
    birth_date = Column(Date, nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)

    guardian_full_name = Column(String(255), nullable=True)
    guardian_phone = Column(String(20), nullable=True)
    guardian_email = Column(String(255), nullable=True)

    diagnosis_notes = Column(Text, nullable=True)
    assessment_expiry_date = Column(Date, nullable=True)

    approved_sessions = Column(Integer, nullable=False, default=0)
    remaining_sessions = Column(Integer, nullable=False, default=0)

    notes = Column(Text, nullable=True)

    center = relationship("Center")
    sessions = relationship("TherapySession", back_populates="student", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="student", cascade="all, delete-orphan")