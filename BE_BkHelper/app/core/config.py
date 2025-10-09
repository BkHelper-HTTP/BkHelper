from pydantic import BaseModel, ConfigDict
from typing import Optional

class Settings(BaseModel):
    # Database
    DATABASE_URL: str = "sqlite:///./hcmut_app.db"
    
    # HCMUT Credentials
    HCMUT_USERNAME: Optional[str] = None
    HCMUT_PASSWORD: Optional[str] = None
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    model_config = ConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()