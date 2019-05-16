from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Allowed hosts not needed in dev mode.
ALLOWED_HOSTS = IP_ADDRESS_LIST
ALLOWED_HOSTS.extend(HOSTNAME_LIST)

CORS_ORIGIN_WHITELIST = (
    '{}'.format(FRONTEND_HOST),
)

CORS_ALLOW_CREDENTIALS = True

CORS_EXPOSE_HEADERS = (
    'authorization',
)
