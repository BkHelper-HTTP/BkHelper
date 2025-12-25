from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.comment import Comment
from app.core.security import get_current_user
from app.services import comment_services

router = APIRouter()

class CommentCreate(BaseModel):
    discussion_id: str
    content: str
    parent_comment_id: Optional[str] = None

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    comment_id: str
    discussion_id: str
    user_id: str
    content: str
    created_at: datetime
    replies: List["CommentResponse"] = []

    class Config:
        from_attributes = True

CommentResponse.model_rebuild()

@router.post("/create_comment")
def create_comment(
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = comment_services.create_comment(
        db=db,
        user_id=current_user["user_id"],
        discussion_id=data.discussion_id,
        content=data.content,
        parent_comment_id=data.parent_comment_id
    )

    return {"status": "success", "data": comment}

@router.get("/get_comments/{discussion_id}")
def get_comments(discussion_id: str, db: Session = Depends(get_db)):
    comments = comment_services.get_comments(db, discussion_id)

    return {"status": "success", "data": comments}

@router.patch("/update_comment/{comment_id}")
def update_comment(
    comment_id: str,
    data: CommentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = comment_services.get_comment(db, comment_id)
    comment_services.update_comment(
        db=db,
        comment=comment,
        user_id=current_user["user_id"],
        content=data.content
    )

    return {"status": "success"}

@router.delete("/delete_comment/{comment_id}")
def delete_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    comment = comment_services.get_comment(db, comment_id)
    comment_services.soft_delete_comment(db, comment, user_id=current_user["user_id"])

    return {"status": "deleted"}