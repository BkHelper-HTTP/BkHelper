from app.models.user import User

from app.services.avatar_services import upload_avatar

def get_or_create_user(db, *, lms_id, student_code, first_name, last_name, email, avatar_url):
    user = db.query(User).filter(User.student_code == student_code).first()

    if user:
        return user
    
    avatar_url1 = upload_avatar(avatar_url, student_code)

    user = User(
        lms_id=lms_id,
        student_code=student_code,
        first_name=first_name,
        last_name=last_name,
        email=email,
        avatar_url=avatar_url1
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user