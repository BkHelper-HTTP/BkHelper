from fastapi import APIRouter, Depends, HTTPException
from app.services.scraping import HCMUTScraper

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login")
async def login_hcmut(username: str, password: str):
    """Đăng nhập HCMUT và lấy thông tin"""
    scraper = HCMUTScraper()
    success = scraper.login(username, password)
    
    if not success:
        raise HTTPException(status_code=401, detail="Login failed")
    
    return {"message": "Login successful", "session_active": True}