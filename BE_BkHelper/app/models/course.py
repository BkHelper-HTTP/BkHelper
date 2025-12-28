import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.sql import func
from .base import Base

class Course(Base):
    __tablename__ = "courses"
    
    course_id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(CHAR(36), ForeignKey("users.user_id"), nullable=False)
    # forum_id = Column(CHAR(36), ForeignKey("forums.forum_id"), nullable=False)
    course_id_lms = Column(String(50), nullable=False)
    course_name = Column(String(255), nullable=False)
    course_code = Column(String(20), nullable=False, index=True)
    teacher_first_name = Column(String(100), nullable=False)
    teacher_last_name = Column(String(100), nullable=False)
    teacher_email = Column(String(255))
    semester = Column(String(10), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())