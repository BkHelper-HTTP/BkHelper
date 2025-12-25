import uuid
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.sql import func
from .base import Base

class Discussion(Base):
    __tablename__ = "discussions"

    discussion_id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    forum_id = Column(CHAR(36), ForeignKey("forums.forum_id"), nullable=False)
    user_id = Column(CHAR(36), ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)