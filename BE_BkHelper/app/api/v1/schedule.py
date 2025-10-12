from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.schedule_services import HCMUTMyBKService
from typing import Optional
from app.utils.schedule_transformer import transform_schedule_to_agenda

router = APIRouter()

class ScheduleRequest(BaseModel):
    username: str
    password: str
    semester_year: Optional[str] = None


@router.post("/fetch-schedule")
def fetch_schedule(data: ScheduleRequest):
    try:
        service = HCMUTMyBKService(data.username, data.password)
        semester_year = data.semester_year
        if semester_year is None or semester_year.lower() == "null":
            semester_year = service.get_current_semester_year()
        schedule = service.get_full_schedule(semester_year)
        agenda_schedule = transform_schedule_to_agenda(schedule)
        return {"status": "success", "data": agenda_schedule}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))