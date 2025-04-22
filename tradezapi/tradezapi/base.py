import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

# Try one of these email backends:
# 1. Console backend (prints to console):
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')

# 2. File backend (writes to file):
# EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
# EMAIL_FILE_PATH = os.path.join(BASE_DIR, 'sent_emails')
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

# Print all email settings for debugging
print("EMAIL_BACKEND:", EMAIL_BACKEND)

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


