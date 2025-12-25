# app/services/forum_services.py
from sqlalchemy.orm import Session
from app.models.forum import Forum

class ForumService:

    @staticmethod
    def get_or_create_forum(db: Session, data: dict):
        forum = db.query(Forum).filter(
            Forum.course_id == data["course_id"]
        ).first()

        if forum:
            return forum, False  # đã tồn tại

        forum = Forum(**data)
        db.add(forum)
        db.commit()
        db.refresh(forum)

        return forum, True