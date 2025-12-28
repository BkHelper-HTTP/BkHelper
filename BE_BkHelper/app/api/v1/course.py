from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.course import Course
from app.services import course_services

router = APIRouter()

@router.get("/my-courses")
def get_my_courses(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    courses = course_services.get_my_courses(db=db, user_id=current_user["user_id"])
    print("caocao", current_user["student_code"])
    return {
        "status": "success",
        "data": courses
    }