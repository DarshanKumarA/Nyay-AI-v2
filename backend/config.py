# backend/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

class Settings(BaseSettings):
    """
    Manages application settings and environment variables.
    """
    # Core application settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # API Keys from the .env file
    # CHANGED: We now accept a string called GEMINI_API_KEYS (plural)
    GEMINI_API_KEYS: str
    HF_API_TOKEN: Optional[str] = None 

    # Pydantic-settings configuration
    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

    # NEW: Helper to split the string into a list
    @property
    def api_key_list(self) -> List[str]:
        if not self.GEMINI_API_KEYS:
            return []
        # Splits "key1,key2,key3" into ["key1", "key2", "key3"]
        return [key.strip() for key in self.GEMINI_API_KEYS.split(",") if key.strip()]

# Create a single, importable instance of the settings
settings = Settings()