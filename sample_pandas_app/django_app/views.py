import os

import pandas as pd

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

from .models import UserToken, DataFiles
from .serializers import UserTokenSerializer, DataFilesSerializer

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


def extract_file_of_user(request, user_info):
    file_info = JSONParser().parse(request)
    data_file = DataFiles.objects.filter(
                username=user_info['username']
            ).filter(
                file_name=file_info['file_name']
            )
    return [data_file, file_info]


def check_user_login(request):
    user_info = extract_user_info(request)
    useraccount_valid = update_user_activity(user_info)
    if not useraccount_valid:
        return Response({
            'message': "Your session expired. Please login again."
        }, status=status.HTTP_401_UNAUTHORIZED)
    if not user_info:
        return Response({
            'message': "You must login to upload a file."
        }, status=status.HTTP_401_UNAUTHORIZED)
    return user_info


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
        if not os.path.isdir(os.path.join(settings.MEDIA_ROOT, new_user.username)):
            os.makedirs(os.path.join(settings.MEDIA_ROOT, new_user.username))
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
    user_info = check_user_login(request)

    file_received = request.FILES.get('fileKey')
    if file_received.size>2097152:
        return Response(
            {
                'message': 'File too large. Limit is 2MB'
            }, status=status.HTTP_400_BAD_REQUEST
        )
    if (DataFiles.objects.filter(username=user_info['username']).filter(file_name=file_received.name)):
        return Response(
            {
            'message': 'File exists. Delete the old file before uploading an updated one.'
            }, status=status.HTTP_400_BAD_REQUEST
        )
    # file_name = file_received.name.split(".")[0]
    # file_key = user_info['username'] + file_name
    file_write = open(os.path.join(os.path.join(settings.MEDIA_ROOT, user_info['username']), file_received.name), "w")
    file_contents = file_received.read()
    file_contents = file_contents.decode('utf-8')
    file_write.write(file_contents)
    file_write.close()
    new_data_file = DataFiles()
    new_data_file.username = user_info['username']
    new_data_file.file_name = file_received.name
    new_data_file.save()
    return Response({
        'file_name': file_received.name,
        'file_list': DataFilesSerializer(DataFiles.objects.filter(username=user_info['username']), many=True).data
    })


@api_view(['POST'])
def file_update(request):
    user_info = check_user_login(request)
    data_file, file_info = extract_file_of_user(request, user_info)
    if not data_file:
        return Response({
            'message': 'Something went wrong.'
        }, status=status.HTTP_400_BAD_REQUEST)
    data_file[0].file_description = file_info['file_description']
    data_file[0].make_public = file_info['make_public']
    data_file[0].save()
    return Response({
        'message': 'Updated'
    })


@api_view(['POST'])
def cancel_file_upload(request):
    user_info = check_user_login(request)
    data_file, file_info = extract_file_of_user(request, user_info)
    if not data_file:
        return Response({
            'message': 'Something went wrong.'
        }, status=status.HTTP_400_BAD_REQUEST)
    os.remove(os.path.join(os.path.join(settings.MEDIA_ROOT, user_info['username']), data_file[0].file_name))
    data_file[0].delete()

    return Response({
        'message': 'Upload canceled'
    })


@api_view(['GET'])
def fetch_file_list(request):
    user_info = extract_user_info(request)
    if user_info:
        user_file_list = DataFiles.objects.filter(username=user_info['username'])
        public_file_list = DataFiles.objects.exclude(username=user_info['username']).filter(make_public=True)
    else:
        user_file_list = []
        public_file_list = DataFiles.objects.filter(make_public=True)
    return Response({
        'user_file_list': DataFilesSerializer(user_file_list, many=True).data,
        'public_file_list': DataFilesSerializer(public_file_list, many=True).data
    })


@api_view(['POST'])
def load_file(request):
    user_info = extract_user_info(request)
    file_received = JSONParser().parse(request)
    if user_info:
        user_name = user_info['username']
    else:
        user_name = file_received['user_name']
    extract_file = DataFiles.objects.filter(username=user_name).filter(file_name=file_received['file_name'])
    if extract_file:
        if (not user_info) and (extract_file[0].make_public==False):
            return Response({
                'message': 'Not authorized to load this file.'
            }, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({
            'message': 'File could not be found'
        }, status=status.HTTP_400_BAD_REQUEST)
    if file_received['file_name'] not in data_files:
        data_files[file_received['file_name']] = pd.read_csv(os.path.join(
            settings.MEDIA_ROOT,
            os.path.join(user_name, file_received['file_name'])
        ))
    data_frame = data_files[file_received['file_name']].to_json(orient='split')
    return Response({
        'message': 'Loaded',
        'dataframe': data_frame
    })


@api_view(['POST'])
def delete_file(request):
    user_info = extract_user_info(request)
    file_received = JSONParser().parse(request)
    if not user_info:
        return Response({
            'message': 'You are not logged in/session expired.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    file_object = DataFiles.objects.filter(username=user_info['username']).filter(file_name=file_received['file_name'])
    if not file_object:
        return Response({
            'message': 'You do not have permission to delete the file.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    file_object[0].delete()
    return Response({
        'message': 'Deleted'
    })
