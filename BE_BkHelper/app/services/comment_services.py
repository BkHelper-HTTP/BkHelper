from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.comment import Comment
from app.services import information_services

def create_comment(db: Session, user_id: str, discussion_id: str, content: str, parent_comment_id: str | None = None):
    comment = Comment(
        discussion_id=discussion_id,
        user_id=user_id,
        content=content,
        parent_comment_id=parent_comment_id
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments(db: Session, discussion_id: str):
    comments = db.query(Comment).filter(
        Comment.discussion_id == discussion_id,
        Comment.is_deleted == False
    ).all()

    comment_map = {}
    roots = []

    for c in comments:
        c.user = information_services.get_user_info(db, c.user_id)
        c.replies = []
        comment_map[c.comment_id] = c

    for c in comments:
        if c.parent_comment_id:
            parent = comment_map.get(c.parent_comment_id)
            if parent:
                parent.replies.append(c)
        else:
            roots.append(c)

    return roots

def get_comment(db: Session, comment_id: str):
    comment = db.query(Comment).filter(
        Comment.comment_id == comment_id,
        Comment.is_deleted == False
    ).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    return comment

def update_comment(db: Session, comment: Comment, user_id: str, content: str):
    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    comment.content = content
    db.commit()
    db.refresh(comment)
    return comment

def soft_delete_comment( db: Session, comment: Comment, user_id: str):
    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    comment.is_deleted = True
    db.commit()