from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.core.security import get_current_user
from app.services import media_services

router = APIRouter()

@router.post("/upload_media/{discussion_id}")
def upload_media(
    discussion_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image file")

    image_bytes = file.file.read()

    media = media_services.upload_media(
        db=db,
        discussion_id=discussion_id,
        user_id=current_user["user_id"],
        image_bytes=image_bytes
    )

    return {
        "status": "success",
        "data": {
            "media_id": media.media_id,
            "image_url": media.image_url
        }
    }


@router.get("/get_media/{discussion_id}")
def get_media(
    discussion_id: str,
    db: Session = Depends(get_db)
):
    media_list = media_services.list_media(db, discussion_id)
    return {
        "status": "success",
        "data": media_list
    }


@router.delete("/delete_media/{media_id}")
def delete_media(
    media_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    media_services.delete_media(
        db=db,
        media_id=media_id,
        user_id=current_user["user_id"]
    )

    return {"status": "deleted"}