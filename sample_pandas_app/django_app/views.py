import os

from django.shortcuts import render
from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status

import jwt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from .models import UserToken
from .serializers import UserTokenSerializer

from django.conf import settings

data_files = {}

# Create your views here.

def extract_user_info(request):
    if not request.META.get('HTTP_AUTHORIZATION'):
        return None
    user_info = jwt.decode(
        request.META.get('HTTP_AUTHORIZATION'),
        settings.JWT_SECRET
    )
    return user_info


def delete_user_tokens(user_name):
    all_user_logins = UserToken.objects.filter(username=user_name)
    for redundant_usertokens in all_user_logins:
        user_token = UserToken.objects.get(id=int(redundant_usertokens.id))
        user_token.delete()
    return


def update_user_activity(user_object):
    if user_object:
        user_token = UserToken.objects.get(id=int(user_object['id']))
        time_difference = timezone.now() - user_token.updation_time
        if (time_difference.total_seconds() > 60):
            delete_user_tokens(user_object['username'])
            return 0
        user_token.updation_time = timezone.now()
        user_token.save()
    return 1


class NewUser(APIView):
    def post(self, request, *args, **kwargs):
        new_user_data = JSONParser().parse(request)
        new_user = User(username=new_user_data["username"])
        new_user.set_password(new_user_data["password"])
        try:
            new_user.save()
        except:
            return Response({
                'message': 'Registration failed.'
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            "user": {
                "username": new_user.username
            }
        })


@api_view(['POST'])
def user_login(request):
    login_data = JSONParser().parse(request)
    user_account = authenticate(
        username=login_data["username"],
        password=login_data["password"]
    )
    if user_account is not None:
        delete_user_tokens(user_account.username)
        user_token_object = UserToken()
        user_token_object.username = user_account.username
        user_token_object.creation_time = timezone.now()
        user_token_object.updation_time = timezone.now()
        user_token_object.save()
        user_jwt_token = jwt.encode(
            {
                'id': user_token_object.id,
                'username': user_account.username
            },
            settings.JWT_SECRET
        )
        user_token_object.jwt_token = user_jwt_token
        user_token_object.save()
        return Response({
            'user': user_account.username
        }, headers={
            'Authorization': user_jwt_token
        })
    else:
        return Response({
            'message': "User login/password incorrect."
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_logout(request):
    user_info = extract_user_info(request)
    user_object = UserToken.objects.get(id=int(user_info['id']))
    user_object.delete()
    return Response({
        'message': 'Logged out'
    })


@api_view(['POST'])
def file_upload(request):
    user_info = extract_user_info(request)
    useraccount_valid = update_user_activity(user_info)
    if useraccount_valid:
        if user_info:
            user_object = UserToken.objects.get(id=int(user_info['id']))
        else:
            return Response({
                'message': "You must login to upload a file."
            }, status=status.HTTP_401_UNAUTHORIZED)
        file_received = request.FILES.get('fileKey')
        file_name = file_received.name.split(".")[0]
        file_key = user_info['username'] + file_name
        file_write = open(os.path.join(settings.MEDIA_ROOT, file_received.name), "w")
        file_contents = file_received.read()
        file_contents = file_contents.decode('utf-8')
        file_write.write(file_contents)
        file_write.close()
        return Response({
            'message': 'Received'
        })
    else:
        return Response({
            'message': "Your session expired. Please login again."
        }, status=status.HTTP_401_UNAUTHORIZED)
