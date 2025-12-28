from sqlalchemy.orm import Session
from app.models.course import Course

def create_courses_from_schedule(db: Session, user_id: str, schedule: list):

    created_courses = []

    for item in schedule:
        # ==== LẤY FIELD CẦN THIẾT ====
        subject = item.get("subject", {})
        employee = item.get("employee", {})
        subject_class_group = item.get("subjectClassGroup", {})

        course_id_lms = subject_class_group.get("subjectClassGroupCode")
        if not course_id_lms:
            continue  # bỏ qua nếu thiếu khóa chính

        # ==== CHECK TRÙNG ====
        existed = db.query(Course).filter(
            Course.user_id == user_id,
            Course.course_id_lms == course_id_lms
        ).first()

        if existed:
            continue

        course = Course(
            user_id=user_id,
            course_id_lms=course_id_lms,
            course_code=subject.get("code"),
            course_name=subject.get("nameVi"),
            teacher_first_name=employee.get("firstName"),
            teacher_last_name=employee.get("lastName"),
            teacher_email=employee.get("email"),
            semester=item.get("semesterYearCode")
        )

        db.add(course)
        created_courses.append(course)

    if created_courses:
        db.commit()

    return created_courses

def get_my_courses(db: Session, user_id: str):
    return db.query(Course).filter(
        Course.user_id == user_id
    ).order_by(Course.created_at.desc()).all()