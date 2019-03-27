from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# MIDDLEWARE.remove('django.middleware.csrf.CsrfViewMiddleware')

# CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    'localhost:3000',
)
CORS_ALLOW_CREDENTIALS = True

CORS_EXPOSE_HEADERS = (
    'authorization',
)
