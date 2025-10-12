from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraping import HCMUTMyBKService

router = APIRouter()

class ScheduleRequest(BaseModel):
    username: str
    password: str
    semester_year: str = "20251"

@router.post("/fetch-schedule")
def fetch_schedule(data: ScheduleRequest):
    try:
        service = HCMUTMyBKService(data.username, data.password)
        schedule = service.get_full_schedule(data.semester_year)
        return {"status": "success", "data": schedule}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))