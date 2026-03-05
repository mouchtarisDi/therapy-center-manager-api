from sqlalchemy.orm import Session

from app.models.student import Student


def create_student(db: Session, center_id: int, first_name: str, last_name: str):
    student = Student(
        center_id=center_id,
        first_name=first_name,
        last_name=last_name,
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return student


def get_students(db: Session, center_id: int):
    return db.query(Student).filter(Student.center_id == center_id).all()