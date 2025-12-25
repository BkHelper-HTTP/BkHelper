from fastapi import APIRouter, Depends, HTTPException
from app.services.forum_services import ForumService
from app.core.security import get_current_user
from app.db.deps import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel

router = APIRouter()

class CreateForum(BaseModel):
    forum_name: str
    course_id: str
    course_code: str
    teacher_first_name: str
    teacher_last_name: str
    teacher_email: str
    semester: str

@router.post("/create_forum")
def create_forum(
    data: CreateForum,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        forum, created = ForumService.get_or_create_forum(
            db,
            data.dict()
        )

        return {
            "status": "success",
            "created": created,
            "forum": {
                "forum_id": forum.forum_id,
                "forum_name": forum.forum_name,
                "course_id": forum.course_id,
                "course_code": forum.course_code,
                "semester": forum.semester,
                "created_at": forum.created_at
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))