# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraping import HCMUTLMSService

router = APIRouter()

class LoginSchema(BaseModel):
    username: str
    password: str

@router.post("/lms-login")
def lms_login(data: LoginSchema):
    try:
        service = HCMUTLMSService(data.username, data.password)
        login_data = service.login()
        return {"status": "success", "sesskey": login_data['sesskey'], "cookies": login_data['cookies']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))