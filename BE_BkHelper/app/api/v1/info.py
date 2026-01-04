from fastapi import APIRouter, HTTPException, Response, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.services.information_services import InformationService
from app.services import information_services
from app.services.notification_services import HCMUTLMSService
from app.core.security import get_current_user

router = APIRouter()

class InfoRequest(BaseModel):
    cookies: dict = None
    token: str = None

class User(BaseModel):
    user_id: str


@router.post("/fetch-user-avatar")
def fetch_user_avatar(data: InfoRequest):
    """
    API trả trực tiếp hình ảnh đại diện (avatar) của user hiện tại trên LMS HCMUT.
    """
    try:
        # Khởi tạo service và truyền cookie đã đăng nhập
        lms_service = HCMUTLMSService("", "")
        lms_service.session.cookies.update(data.cookies)
        lms_service.cookies = data.cookies

        # Gọi service lấy thông tin người dùng
        info_service = InformationService(lms_service.session, lms_service.cookies)
        result = info_service.get_user_image()

        # Tùy loại ảnh (jpg/png) mà xác định Content-Type
        content_type = "image/jpeg"
        if result["image_url"].lower().endswith(".png"):
            content_type = "image/png"

        # Trả ảnh trực tiếp
        return Response(content=result["image_bytes"], media_type=content_type)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/fetch-user-information")
def fetch_user_information(data: InfoRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """
    API trả thông tin chi tiết của user từ MyBK.
    Chỉ cần token MyBK, không trả avatar (avatar đã có API riêng).
    """
    user = information_services.get_user_info(db=db, user_id=current_user["user_id"])
    try:
        if not data.token:
            raise HTTPException(status_code=400, detail="Token MyBK chưa được cung cấp.")

        # Khởi tạo InformationService chỉ với token MyBK
        info_service = InformationService(mybk_token=data.token)

        # Lấy user_id từ MyBK
        user_id = info_service.get_mybk_user_id()

        # Lấy thông tin chi tiết
        user_detail = info_service.get_mybk_user_detail(user_id)

        return {"user_detail": user_detail,
                "avatar_url": user.avatar_url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/user-info/{user_id}")
def get_user_info(user_id: str, db = Depends(get_db)):
    user = information_services.get_user_info(user_id=user_id, db=db)
    return {user}