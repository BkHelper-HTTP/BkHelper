# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraping import HCMUTLMSService

router = APIRouter()

class LoginSchema(BaseModel):
    username: str
    password: str

class LogoutSchema(BaseModel):
    sesskey: str
    cookies: dict

@router.post("/lms-login")
def lms_login(data: LoginSchema):
    try:
        service = HCMUTLMSService(data.username, data.password)
        login_data = service.login()
        return {"status": "success", "sesskey": login_data['sesskey'], "cookies": login_data['cookies'], "userid": login_data['userid']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/lms-logout")
def lms_logout(data: LogoutSchema):
    try:
        service = HCMUTLMSService(username="", password="")
        service.session.cookies.update(data.cookies)
        result = service.logout(data.sesskey)
        return {"status": "success", "detail": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))