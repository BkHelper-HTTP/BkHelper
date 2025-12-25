import uuid
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.sql import func
from .base import Base

class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column( CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    discussion_id = Column(
        CHAR(36),
        ForeignKey("discussions.discussion_id"),
        nullable=False
    )

    user_id = Column(
        CHAR(36),
        ForeignKey("users.user_id"),
        nullable=False
    )

    parent_comment_id = Column(
        CHAR(36),
        ForeignKey("comments.comment_id"),
        nullable=True
    )

    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)