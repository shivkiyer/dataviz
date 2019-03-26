from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['POST'])
def test_api(request):
    print(request.FILES)
    fileObject = request.FILES.get('fileKey')
    file_contents = fileObject.read()
    print(file_contents)
    return Response({
        "message": "read"
    })
