from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import UserToken, DataFiles


class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToken
        fields = (
            'username',
            'jwt_token',
            'creation_time',
        )


class DataFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataFiles
        fields = (
            'username',
            'file_name',
            'file_description',
            'make_public',
        )
