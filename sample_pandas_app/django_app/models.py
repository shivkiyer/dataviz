from django.db import models

# Create your models here.

class UserToken(models.Model):
    username = models.CharField(max_length=100)
    jwt_token = models.CharField(max_length=500, blank=True, null=True)
    creation_time = models.DateTimeField()
    updation_time = models.DateTimeField()

    def __str__(self):
        return str(self.username)

    def __unicode__(self):
        return str(self.username)


class DataFiles(models.Model):
    username = models.CharField(max_length=100)
    file_name = models.CharField(max_length=100)
    file_description = models.TextField(blank=True, null=True)
    make_public = models.BooleanField(default=False)

    def __str__(self):
        return str(self.file_name) + " created by " + str(self.username)

    def __unicode__(self):
        return str(self.file_name) + " created by " + str(self.username)
