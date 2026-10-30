"""Application configuration using pydantic-settings.

Loads settings from environment variables and .env file.
All external service credentials are optional with safe defaults
so the app can run standalone without any API keys.
"""

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────
    APP_NAME: str = "SignalSafe API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # ── CORS ──────────────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # ── Supabase (optional – Phase 1+) ────────────────────────────────
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # ── LLM (optional – Phase 2+) ────────────────────────────────────
    LLM_API_KEY: str = ""

    # ── Telegram Bot (optional – Phase 3+) ────────────────────────────
    TELEGRAM_BOT_TOKEN: str = ""


settings = Settings()
