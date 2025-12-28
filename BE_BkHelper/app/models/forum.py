import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.sql import func
from .base import Base

class Forum(Base):
    __tablename__ = "forums"

    forum_id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    forum_name = Column(String(255), nullable=False)
    course_id = Column(String(50), nullable=False, unique=True)
    course_code = Column(String(20), nullable=False, index=True)
    teacher_first_name = Column(String(100), nullable=False)
    teacher_last_name = Column(String(100), nullable=False)
    teacher_email = Column(String(255))
    semester = Column(String(10), nullable=False)
    created_at = Column(DateTime, server_default=func.now())