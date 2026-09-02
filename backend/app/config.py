import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///portfolio.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGINS = [
        origin.strip()
        for origin in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    CONTACT_RATE_LIMIT_SECONDS = int(os.getenv("CONTACT_RATE_LIMIT_SECONDS", "60"))
