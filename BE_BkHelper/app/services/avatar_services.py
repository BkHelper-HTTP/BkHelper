import cloudinary.uploader
from app.core.cloudinary import cloudinary

def upload_avatar(image_bytes: bytes, student_code: str):
    result = cloudinary.uploader.upload(
        image_bytes,
        student_code=f"avatars/{student_code}",
        folder="avatars",
        overwrite=True,
        resource_type="image"
    )
    return result["secure_url"]