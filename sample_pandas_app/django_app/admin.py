from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.UserToken)
admin.site.register(models.DataFiles)
