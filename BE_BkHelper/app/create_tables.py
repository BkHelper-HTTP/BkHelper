from app.db.database import engine
from app.models.base import Base

# import tất cả model để SQLAlchemy biết
from app.models.user import User
from app.models.forum import Forum
from app.models.discussion import Discussion
from app.models.media import Media
from app.models.comment import Comment

def create_tables():
    print("⏳ Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully")

if __name__ == "__main__":
    create_tables()