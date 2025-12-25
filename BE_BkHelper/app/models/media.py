import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.sql import func
from .base import Base

class Media(Base):
    __tablename__ = "media"

    media_id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    discussion_id = Column(
        CHAR(36),
        ForeignKey("discussions.discussion_id", ondelete="CASCADE"),
        nullable=False
    )
    image_url = Column(String(500), nullable=False)
    cloudinary_public_id = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())