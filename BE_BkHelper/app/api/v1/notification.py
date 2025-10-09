# # app/api/v1/notification.py
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from app.services.scraping import HCMUTLMSService

# router = APIRouter()

# class NotifyRequest(BaseModel):
#     username: str
#     password: str

# @router.post("/fetch")
# def fetch_notifications(data: NotifyRequest):
#     try:
#         service = HCMUTLMSService(data.username, data.password)
#         login_data = service.login()  # Gồm: sesskey, userid, cookies
#         notifications = service.get_notifications(
#             sesskey=login_data['sesskey'],
#             userid=login_data['userid']
#         )
#         return {
#             "status": "success",
#             "data": notifications
#         }
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.services.scraping import HCMUTLMSService

router = APIRouter()

class NotifyRequest(BaseModel):
    sesskey: str
    cookies: dict
    userid: int

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