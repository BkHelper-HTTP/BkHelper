from fastapi import APIRouter
from . import auth, info, schedule, forum, notification, discussion, comment, media, course

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
api_router.include_router(info.router, prefix="/info", tags=["Information"])
api_router.include_router(forum.router, prefix="/forum", tags=["Forum"])
api_router.include_router(course.router, prefix="/course", tags=["Course"])
api_router.include_router(notification.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(discussion.router, prefix="/discussion", tags=["Discussion"])
api_router.include_router(comment.router, prefix="/comment", tags=["Comment"])
api_router.include_router(media.router, prefix="/media", tags=["Media"])