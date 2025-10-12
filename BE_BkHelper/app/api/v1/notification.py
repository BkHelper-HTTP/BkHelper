from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.services.scraping import HCMUTLMSService

router = APIRouter()

class NotifyRequest(BaseModel):
    sesskey: str
    cookies: dict
    userid: int

class NotifyMessagesRequest(NotifyRequest):
    convid: int
    limitnum: int = 101
    limitfrom: int = 1
    newest: bool = True

@router.post("/fetch-notifications")
def fetch_notifications(data: NotifyRequest):
    try:
        service = HCMUTLMSService("", "")  # Không cần username/password nữa
        service.session.cookies.update(data.cookies)
        service.cookies = data.cookies
        notifications = service.get_notifications(sesskey=data.sesskey, userid=data.userid)
        return {"status": "success", "data": notifications}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/fetch-notification-messages")
def fetch_notification_messages(data: NotifyMessagesRequest):
    try:
        service = HCMUTLMSService("", "")
        service.session.cookies.update(data.cookies)
        service.cookies = data.cookies
        messages = service.get_notification_messages(
            sesskey=data.sesskey,
            userid=data.userid,
            convid=data.convid,
            limitnum=data.limitnum,
            limitfrom=data.limitfrom,
            newest=data.newest
        )
        return {"status": "success", "data": messages}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))