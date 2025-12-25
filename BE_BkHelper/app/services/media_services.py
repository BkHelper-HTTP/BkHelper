from sqlalchemy.orm import Session
from fastapi import HTTPException
import cloudinary.uploader

from app.models.media import Media
from app.models.discussion import Discussion


def _check_discussion_owner(db: Session, discussion_id: str, user_id: str) -> Discussion:
    discussion = db.query(Discussion).filter(
        Discussion.discussion_id == discussion_id,
        Discussion.is_deleted == False
    ).first()

    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    if discussion.user_id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")

    return discussion


def upload_media(
    db: Session,
    discussion_id: str,
    user_id: str,
    image_bytes: bytes
):
    _check_discussion_owner(db, discussion_id, user_id)

    media = Media(
        discussion_id=discussion_id,
        image_url="",
        cloudinary_public_id=""
    )
    db.add(media)
    db.flush()

    public_id = f"discussions/{discussion_id}/{media.media_id}"

    try:
        result = cloudinary.uploader.upload(
            image_bytes,
            public_id=public_id,
            folder="medias",
            overwrite=True,
            resource_type="image"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    media.image_url = result["secure_url"]
    media.cloudinary_public_id = public_id

    db.commit()
    db.refresh(media)
    return media


def list_media(db: Session, discussion_id: str):
    return db.query(Media).filter(
        Media.discussion_id == discussion_id
    ).order_by(Media.created_at.asc()).all()


def delete_media(
    db: Session,
    media_id: str,
    user_id: str
):
    media = db.query(Media).filter(
        Media.media_id == media_id
    ).first()

    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    # kiểm tra quyền qua discussion
    _check_discussion_owner(db, media.discussion_id, user_id)

    # xóa cloudinary
    try:
        cloudinary.uploader.destroy(media.cloudinary_public_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    db.delete(media)
    db.commit()