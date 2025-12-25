from sqlalchemy.orm import Session
from datetime import datetime
from app.models.discussion import Discussion
from app.models.media import Media
from fastapi import HTTPException

def create_discussion(db: Session, user_id: str, data):
    discussion = Discussion(
        forum_id=data.forum_id,
        user_id=user_id,
        title=data.title,
        content=data.content
    )
    db.add(discussion)
    db.commit()
    db.refresh(discussion)
    return discussion


def list_discussions(db: Session, forum_id: str):
    return db.query(Discussion).filter(
        Discussion.forum_id == forum_id,
        Discussion.is_deleted == False
    ).order_by(Discussion.created_at.desc()).all()


def get_discussion(db: Session, discussion_id: str):
    discussion = db.query(Discussion).filter(
        Discussion.discussion_id == discussion_id,
        Discussion.is_deleted == False
    ).first()

    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    
    media_list = db.query(Media).filter(
        Media.discussion_id == discussion_id
    ).all()

    return discussion, media_list


def update_discussion(db: Session, discussion: Discussion, user_id: str, data):
    if discussion.user_id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    if data.title is not None:
        discussion.title = data.title
    if data.content is not None:
        discussion.content = data.content

    # cho phép restore
    if data.is_deleted is not None:
        discussion.is_deleted = data.is_deleted
        discussion.deleted_at = None if not data.is_deleted else datetime.utcnow()

    db.commit()
    db.refresh(discussion)
    return discussion


def soft_delete_discussion(db: Session, discussion: Discussion, user_id: str):
    if discussion.user_id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    discussion.is_deleted = True
    discussion.deleted_at = datetime.utcnow()
    db.commit()