from sqlalchemy.orm import Session
from app.models.course import Course

def create_courses_from_schedule(db: Session, user_id: str, schedule: list):

    created_courses = []

    for item in schedule:
        # ==== LẤY FIELD CẦN THIẾT ====
        subject = item.get("subject", {})
        employee = item.get("employee", {})
        subject_class_group = item.get("subjectClassGroup", {})
        room = item.get("room", {})

        course_id_lms = subject_class_group.get("subjectClassGroupCode")

        # ==== CHECK TRÙNG ====
        existed = db.query(Course).filter(
            Course.user_id == user_id,
            Course.course_id_lms == course_id_lms
        ).first()

        if existed:
            updated = False

            if existed.teacher_first_name != employee.get("firstName"):
                existed.teacher_first_name = employee.get("firstName")
                updated = True
            if existed.teacher_last_name != employee.get("lastName"):
                existed.teacher_last_name = employee.get("lastName")
                updated = True
            if existed.teacher_email != employee.get("email"):
                existed.teacher_email = employee.get("email")
                updated = True
            if existed.room_code != room.get("code"):
                existed.room_code = room.get("code")
                updated = True
            if existed.campus != room["building"]["campus"]["nameVi"]:
                existed.campus = room["building"]["campus"]["nameVi"]
                updated = True
            if existed.start_time != item.get("startTime"):
                existed.start_time = item.get("startTime")
                updated = True
            if existed.end_time != item.get("endTime"):
                existed.end_time = item.get("endTime")
                updated = True
            if existed.num_of_credit != subject.get("numOfCredits"):
                existed.num_of_credit = subject.get("numOfCredits")
                updated = True
            if existed.semester != item.get("semesterYearCode"):
                existed.semester = item.get("semesterYearCode")
                updated = True
            if existed.semester_name != item.get("semesterYearName"):
                existed.semester_name = item.get("semesterYearName")
                updated = True

            if updated:
                db.commit()
            
            created_courses.append(existed)
            continue

        course = Course(
            user_id=user_id,
            course_id_lms=course_id_lms,
            course_code=subject.get("code"),
            course_name=subject.get("nameVi"),
            teacher_first_name=employee.get("firstName"),
            teacher_last_name=employee.get("lastName"),
            teacher_email=employee.get("email"),
            class_group=subject_class_group.get("classGroup"),
            start_time=item.get("startTime"),
            end_time=item.get("endTime"),
            room_code=room.get("code"),
            campus=room["building"]["campus"]["nameVi"],
            num_of_credit=subject.get("numOfCredits"),
            semester=item.get("semesterYearCode"),
            semester_name=item.get("semesterYearName")
        )

        db.add(course)
        created_courses.append(course)
        db.commit()
    
    if created_courses:
        db.commit()

    return created_courses

def get_my_courses(db: Session, user_id: str):
    return db.query(Course).filter(
        Course.user_id == user_id
    ).order_by(Course.created_at.desc()).all()