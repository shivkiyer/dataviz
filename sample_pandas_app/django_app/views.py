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


class UserAuth(APIView):
    """
    This class contains methods that deal with user JWT tokens.
    The methods, extract user tokens from the headers to return
    user objects, update time stamps based on user activity and delete
    outdated tokens.
    """
    def extract_user_info(self, request):
        """
        Extract a JWT token from the header and
        return a user dictionary.
        """
        if not request.META.get('HTTP_AUTHORIZATION'):
            self.user_info = None
            return
        self.user_info = jwt.decode(
            request.META.get('HTTP_AUTHORIZATION'),
            settings.JWT_SECRET
        )

    def delete_user_tokens(self, user_name):
        """
        Remove all tokens by a particular user.
        """
        all_user_logins = UserToken.objects.filter(username=user_name)
        for redundant_usertokens in all_user_logins:
            user_token = UserToken.objects.get(id=int(redundant_usertokens.id))
            user_token.delete()
        return

    def update_user_activity(self):
        """
        Updates the last time the token was issued in the
        database table that stores tokens issued to users.
        """
        if self.user_info:
            user_token = UserToken.objects.get(id=int(self.user_info['id']))
            time_difference = timezone.now() - user_token.updation_time
            # Time is in seconds. Can be increased to hours.
            if (time_difference.total_seconds() > 300):
                # All tokens by a user are deleted if a single token is outdated.
                # This might not be necessary. Only outdated token need be deleted.
                self.delete_user_tokens(self.user_info['username'])
                return 0
            user_token.updation_time = timezone.now()
            user_token.save()
        return 1

    def authenticate_user(self, request, *args, **kwargs):
        """
        This method checks is the JWT received is a genuine token
        from the database. If not return a 401 response.
        """
        self.extract_user_info(request)
        useraccount_valid = self.update_user_activity()
        if not useraccount_valid:
            return Response({
                'message': "Your session expired. Please login again."
            }, status=status.HTTP_401_UNAUTHORIZED)
        if not self.user_info:
            return Response({
                'message': "You are either not logged in or do not have authorization to perform this action."
            }, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, *args, **kwargs):
        """
        The next three view functions are never called.
        They are merely inherited and called by child CBVs.
        """
        self.authenticate_user(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        self.authenticate_user(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.authenticate_user(request, *args, **kwargs)


class UserAccount(UserAuth):
    """
    This class creates a new user, logs in a user
    and logs out a user.
    """
    def post(self, request, *args, **kwargs):
        """
        New user is a post request.
        """
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

    def put(self, request, *args, **kwargs):
        """
        User login is a PUT request as a new token
        is inserted in the database.
        """
        login_data = JSONParser().parse(request)
        user_account = authenticate(
            username=login_data["username"],
            password=login_data["password"]
        )
        if user_account is not None:
            # If a user has an active token, these tokens are deleted.
            # May not be necessary as mulitple logins from different
            # devices are quite normal
            self.delete_user_tokens(user_account.username)
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

    def delete(self, request, *args, **kwargs):
        """
        User logout is a delete request where the token is deleted.
        """
        self.extract_user_info(request)
        user_object = UserToken.objects.get(id=int(self.user_info['id']))
        user_object.delete()
        return Response({
            'message': 'Logged out'
        })


class FileOperation(UserAuth):
    """
    This class fetches, creates, edits and deletes a data file
    and associated data.
    """
    def get(self, request, *args, **kwargs):
        """
        Retrieves all files that a user can access.
        For a guest, it is only the public files.
        """
        self.extract_user_info(request)
        # For a guest user_info will be None.
        if self.user_info:
            user_file_list = DataFiles.objects.filter(
                    username=self.user_info['username']
                ).order_by('file_name')
            public_file_list = DataFiles.objects.exclude(
                    username=self.user_info['username']
                ).filter(
                    make_public=True
                ).order_by('file_name')
        else:
            user_file_list = []
            public_file_list = DataFiles.objects.filter(
                    make_public=True
                ).order_by('file_name')
        return Response({
            'user_file_list': DataFilesSerializer(user_file_list, many=True).data,
            'public_file_list': DataFilesSerializer(public_file_list, many=True).data
        })

    def post(self, request, *args, **kwargs):
        """
        This method uploads a file with default file
        description and privacy option.
        """
        super().post(request, *args, **kwargs)
        file_received = request.FILES.get('fileKey')
        # File size is limited to 2MB
        if file_received.size>2097152:
            return Response(
                {
                    'message': 'File too large. Limit is 2MB'
                }, status=status.HTTP_400_BAD_REQUEST
            )
        # Cannot upload a file that already exists to prevent overwriting.
        if (DataFiles.objects.filter(
                username=self.user_info['username']).filter(
                file_name=file_received.name)):
            return Response(
                {
                'message': 'File exists. Delete the old file before uploading an updated one.'
                }, status=status.HTTP_400_BAD_REQUEST
            )
        # A user's file is written to a directory by the user's name
        file_write = open(os.path.join(
                os.path.join(
                        settings.MEDIA_ROOT,
                        self.user_info['username']
                        ),
                file_received.name), "w")
        file_contents = file_received.read()
        file_contents = file_contents.decode('utf-8')
        file_write.write(file_contents)
        file_write.close()
        # This new file is stored in the database.
        new_data_file = DataFiles()
        new_data_file.username = self.user_info['username']
        new_data_file.file_name = file_received.name
        new_data_file.save()
        return Response({
            'file_name': file_received.name,
            'file_list': DataFilesSerializer(
                            DataFiles.objects.filter(
                                    username=self.user_info['username']
                                    ).order_by('file_name'),
                            many=True).data
        })

    def patch(self, request, *args, **kwargs):
        """
        This method lets you edit the file description and privacy setting.
        """
        super().patch(request, *args, **kwargs)
        file_info = JSONParser().parse(request)
        data_file = DataFiles.objects.filter(
                    username=self.user_info['username']
                ).filter(
                    file_name=file_info['file_name']
                )
        if not data_file:
            return Response({
                'message': 'Something went wrong.'
            }, status=status.HTTP_400_BAD_REQUEST)
        data_file[0].file_description = file_info['file_description']
        data_file[0].make_public = file_info['make_public']
        data_file[0].save()
        return Response({
            'message': 'Updated',
            'file_list': DataFilesSerializer(
                            DataFiles.objects.filter(
                                    username=self.user_info['username']
                                    ).order_by('file_name'),
                            many=True).data
        })

    def delete(self, request, *args, **kwargs):
        """
        This method deletes a file and removes the record from the database.
        """
        super().delete(request, *args, **kwargs)
        if 'id' in kwargs:
            file_id = int(kwargs['id'])
            data_file = DataFiles.objects.get(id=file_id)
        else:
            return Response({
                'message': 'Something went wrong.'
            }, status=status.HTTP_400_BAD_REQUEST)
        os.remove(os.path.join(
                os.path.join(
                        settings.MEDIA_ROOT,
                        self.user_info['username']
                        ),
                    data_file.file_name)
        )
        data_file.delete()
        return Response({
            'message': 'Upload canceled'
        })


class LoadFile(UserAuth):
    """
    This class contains methods for performing operations on data files.
    """
    def get(self, request, *args, **kwargs):
        self.extract_user_info(request)
        user_name = None
        if self.user_info:
            user_name = self.user_info['username']
        file_id = -1
        if 'id' in kwargs:
            file_id = int(kwargs['id'])
        extract_file = DataFiles.objects.filter(id=file_id)
        if extract_file:
            if (not self.user_info) and (extract_file[0].make_public==False):
                return Response({
                    'message': 'Not authorized to load this file.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'message': 'File could not be found'
            }, status=status.HTTP_400_BAD_REQUEST)
        if extract_file[0].file_name not in data_files:
            file_user_name = extract_file[0].username
            data_files[extract_file[0].file_name] = pd.read_csv(os.path.join(
                settings.MEDIA_ROOT,
                os.path.join(file_user_name, extract_file[0].file_name)
            )).head(5)
        data_frame = data_files[extract_file[0].file_name].to_json(orient='split')
        return Response({
            'message': 'Loaded',
            'dataframe': data_frame
        })
