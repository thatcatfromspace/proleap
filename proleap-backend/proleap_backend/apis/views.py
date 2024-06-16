from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.tokens import AccessToken, TokenError

from .models import User, Batch, UserBatch
from .serializers import UserSerializer, BatchSerializer, UserBatchSerializer

class UserListAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [AllowAny()]

    @swagger_auto_schema(
        operation_description="Retrieve a list of users",
        responses={200: UserSerializer(many=True)},
    )
    def get(self, request):
        try:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new user",
        request_body=UserSerializer,
        responses={201: UserSerializer, 400: 'Bad Request'},
    )
    def post(self, request, format=None):
        try:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': serializer.data
                }, status=status.HTTP_201_CREATED)
                # return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserDetailAPIView(APIView):
    permission_classes = [AllowAny] #Todo: Authenticate to ISauth

    @swagger_auto_schema(
        operation_description="Retrieve a user by ID",
        responses={200: UserSerializer, 404: 'Not Found'},
        manual_parameters=[
            openapi.Parameter(
                'access_token',
                openapi.IN_QUERY,
                description='JWT access token',
                type=openapi.TYPE_STRING,
                required=True,
            ),
        ],
    )
    def get(self, request, id):
        access_token = request.query_params.get('access_token', '')

        try:
            validated_token = AccessToken(access_token)
            print(validated_token.payload)  # Log the token payload
            user_id = validated_token['user_id']
            user = User.objects.get(pk=id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except TokenError as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @swagger_auto_schema(
        operation_description="Update a user by ID",
        request_body=UserSerializer,
        responses={200: UserSerializer, 400: 'Bad Request', 404: 'Not Found'},
    )
    def put(self, request, id):
        try:
            user = self.get_object(id)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a user by ID",
        responses={204: 'No Content', 404: 'Not Found'},
    )
    def delete(self, request, id):
        try:
            user = self.get_object(id)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class SignInAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        tags=['auth',],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
            }
        ),
        responses={
            200: openapi.Response(
                description='Successful login',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
                        'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access token'),
                        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='User ID'),
                    }
                )
            ),
            400: 'Invalid input',
            401: 'Unauthorized'
        }
    )
    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
            print(user.email, user.password)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if (user.password == password):     #TODO: Use user.check_password()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        

class BatchListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all batches",
        responses={200: BatchSerializer(many=True)}
    )
    def get(self, request):
        try:
            batches = Batch.objects.all()
            serializer = BatchSerializer(batches, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new batch",
        request_body=BatchSerializer,
        responses={
            201: BatchSerializer,
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = BatchSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class BatchDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve a batch by ID",
        responses={
            200: BatchSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            batch = Batch.objects.get(pk=pk)
            serializer = BatchSerializer(batch)
            return Response(serializer.data)
        except Batch.DoesNotExist:
            return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update a batch by ID",
        request_body=BatchSerializer,
        responses={
            200: BatchSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            batch = Batch.objects.get(pk=pk)
            serializer = BatchSerializer(batch, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Batch.DoesNotExist:
            return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a batch by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            batch = Batch.objects.get(pk=pk)
            batch.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Batch.DoesNotExist:
            return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)