from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allowed hosts not needed in dev mode.
ALLOWED_HOSTS = []

# CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    '{}'.format(FRONTEND_HOST),
)
CORS_ALLOW_CREDENTIALS = True

CORS_EXPOSE_HEADERS = (
    'authorization',
)
