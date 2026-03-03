from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "QashFlow Inference API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8001

    cors_origins: str = "http://localhost:3000"

    model_checkpoint_path: str = "../saved_models/model.pth"
    scaler_path: str = "../saved_models/scaler.pkl"
    allow_fallback_predictor: bool = True

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
