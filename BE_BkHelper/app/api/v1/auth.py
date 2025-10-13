# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from app.services.scraping import HCMUTCASBase, HCMUTLMSService, HCMUTMyBKService, login_all, logout_all

router = APIRouter()

class LoginSchema(BaseModel):
    username: str
    password: str

class LogoutSchema(BaseModel):
    sesskey: str
    cookies: dict

# @router.post("/lms-login")
# def lms_login(data: LoginSchema):
#     try:
#         service = HCMUTLMSService(data.username, data.password)
#         login_data = service.login()
#         return {"status": "success", "sesskey": login_data['sesskey'], "cookies": login_data['cookies'], "userid": login_data['userid']}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
# @router.post("/lms-login")
# def lms_login(data: LoginSchema):
#     try:
#         # 1️⃣ Login CAS
#         cas = HCMUTCASBase(data.username, data.password)
#         redirect_url, session = cas.cas_login("https://lms.hcmut.edu.vn/login/index.php?authCAS=CAS")

#         # 2️⃣ Login LMS bằng session CAS
#         service = HCMUTLMSService(session)
#         login_data = service.login()

#         return {
#             "status": "success",
#             "sesskey": login_data['sesskey'],
#             "userid": login_data['userid'],
#             "cookies": login_data['cookies']
#         }

#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/lms-logout")
def lms_logout(data: LogoutSchema):
    try:
        service = HCMUTLMSService(username="", password="")
        service.session.cookies.update(data.cookies)
        result = service.logout(data.sesskey)
        return {"status": "success", "detail": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/hcmut-login")
def unified_login(data: LoginSchema):
    try:
        result = login_all(data.username, data.password)
        return {
            "status": "success",
            "mybk": result["mybk"],
            "lms": result["lms"],
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/hcmut-logout")
def hcmut_logout(data: LogoutSchema):
    """
    Đăng xuất toàn bộ khỏi HCMUT SSO (LMS + MyBK + CAS)
    """
    try:
        # Tạo session mới và gắn cookies đã có
        session = requests.Session()
        session.cookies.update(data.cookies)

        # Gọi hàm logout_all
        result = logout_all(session, data.sesskey)

        if not result.get("ok"):
            raise HTTPException(status_code=400, detail=result.get("msg"))

        return {"status": "success", "data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))