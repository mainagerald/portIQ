import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

# Email backend settings (read from .env)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

SIMPLE_JWT = {
    # "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "SIGNING_KEY": os.getenv("SECRET_KEY"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

FRONTEND_URL_LOCAL="http://localhost:5173"
FRONTEND_URL="https://tradez.com"

CORS_ALLOWED_ORIGINS=[FRONTEND_URL_LOCAL, FRONTEND_URL]


