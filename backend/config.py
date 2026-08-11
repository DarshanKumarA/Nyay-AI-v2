# backend/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Manages application settings and environment variables.
    """
    # Core application settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # API Keys & Models from the .env file
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL_NAME: str = "gemini-2.5-flash"
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL_NAME: str = "meta-llama/llama-3.3-70b-instruct"
    HF_API_TOKEN: Optional[str] = None # Making this optional as it's not used yet

    # Pydantic-settings configuration
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')
    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

# Create a single, importable instance of the settings
settings = Settings()