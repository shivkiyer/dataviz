from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import UserToken


class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToken
        fields = (
            'username',
            'jwt_token',
            'creation_time',
        )
