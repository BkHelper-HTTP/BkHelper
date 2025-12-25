from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.services import discussion_services
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DiscussionCreate(BaseModel):
    forum_id: str
    title: str
    content: str

class DiscussionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_deleted: Optional[bool] = None

class DiscussionResponse(BaseModel):
    discussion_id: str
    forum_id: str
    user_id: str
    title: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

router = APIRouter()

@router.post("/create_discussion", response_model=DiscussionResponse)
def create_discussion(
    data: DiscussionCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    return discussion_services.create_discussion(
        db,
        user_id=current_user["user_id"],
        data=data
    )


@router.get("/list_discussions")
def list_discussions(
    forum_id: str,
    db = Depends(get_db)
):
    discussions = discussion_services.list_discussions(db, forum_id)
    return {"status": "success", "data": discussions}


@router.get("/get_discussion/{discussion_id}")
def get_discussion(
    discussion_id: str,
    db = Depends(get_db)
):
    discussion = discussion_services.get_discussion(db, discussion_id)
    return {"status": "success", "data": discussion}


@router.patch("/update_discussion/{discussion_id}")
def update_discussion(
    discussion_id: str,
    data: DiscussionUpdate,
    db = Depends(get_db),
    current_user=Depends(get_current_user)
):
    discussion = discussion_services.get_discussion(db, discussion_id)
    updated = discussion_services.update_discussion(
        db, discussion, current_user["user_id"], data
    )
    return {"status": "success", "data": updated}


@router.delete("/delete_discussion/{discussion_id}")
def delete_discussion(
    discussion_id: str,
    db = Depends(get_db),
    current_user=Depends(get_current_user)
):
    discussion = discussion_services.get_discussion(db, discussion_id)
    discussion_services.soft_delete_discussion(
        db, discussion, current_user["user_id"]
    )
    return {"status": "success"}