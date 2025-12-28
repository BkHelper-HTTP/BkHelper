# app/api/v1/auth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import requests
from app.services.scraping import login_all, logout_all
from app.services.information_services import InformationService
from app.services.schedule_services import HCMUTMyBKService
from app.services.course_services import create_courses_from_schedule
from app.db.deps import get_db
from app.core.security import create_access_token
from app.db.crud.user import get_or_create_user

router = APIRouter()

class LoginSchema(BaseModel):
    username: str
    password: str

class LogoutSchema(BaseModel):
    sesskey: str
    cookies: dict    

# @router.post("/hcmut-login")
# def unified_login(data: LoginSchema):
#     try:
#         result = login_all(data.username, data.password)
#         return {
#             "status": "success",
#             "mybk": result["mybk"],
#             "lms": result["lms"],
#         }
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/hcmut-login")
def unified_login(data: LoginSchema, db=Depends(get_db)):
    try:
        result = login_all(data.username, data.password)

        # ---- LẤY DỮ LIỆU USER ----
        lms_userid = str(result["lms"]["userid"])

        # Gọi API nội bộ lấy info
        info_service = InformationService(cookies=result["session_cookies"], mybk_token=result["mybk"]["token"])
        user_detail = info_service.get_mybk_user_detail(
            info_service.get_mybk_user_id()
        )["data"]

        image_bytes = info_service.get_user_image()["image_bytes"]

        student_code = user_detail["code"]
        first_name = user_detail["firstName"]
        last_name = user_detail["lastName"]
        email = user_detail["orgEmail"]
    
        user, is_new = get_or_create_user(
            db,
            lms_id=lms_userid,
            student_code=student_code,
            first_name=first_name,
            last_name=last_name,
            email=email,
            avatar_url=image_bytes
        )

        if is_new:
            service = HCMUTMyBKService(token=result["mybk"]["token"], cookies=result["mybk"]["cookies"])
            # semester_year = data.semester_year
            # if semester_year is None or semester_year.lower() == "null":
            semester_year = service.get_current_semester_year()

            schedule = service.get_full_schedule(semester_year)
            create_courses_from_schedule(db=db, user_id=user.user_id, schedule=schedule)

        # ---- TẠO JWT ----
        access_token = create_access_token({
            "user_id": user.user_id,
            "student_code": user.student_code
        })

        return {
            "status": "success",
            "access_token": access_token,
            "mybk": result["mybk"],
            "lms": result["lms"]
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