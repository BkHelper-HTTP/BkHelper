from fastapi import APIRouter
from . import auth, schedule, notes, forum, notification

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
# api_router.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
# api_router.include_router(notes.router, prefix="/notes", tags=["Notes"])
# api_router.include_router(forum.router, prefix="/forum", tags=["Forum"])
api_router.include_router(notification.router, prefix="/notifications", tags=["Notifications"])