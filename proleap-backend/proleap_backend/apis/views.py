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

from .models import User, Batch, UserBatch, Activity, UserActivity, Card, UserCard, Question, Option, Answer
from .serializers import (
    UserSerializer, BatchSerializer, UserBatchSerializer, 
    ActivitySerializer, UserActivitySerializer,
    CardSerializer, UserCardSerializer, 
    QuestionSerializer, OptionSerializer, AnswerSerializer
)

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
            user = User.objects.get(pk=id)
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
            user = User.objects.get(pk=id)
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
        responses={200: BatchSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
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


class UserBatchListCreateAPIView(APIView):

    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all user batches",
        responses={200: UserBatchSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            user_batches = UserBatch.objects.all()
            serializer = UserBatchSerializer(user_batches, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new user batch",
        request_body=UserBatchSerializer,
        responses={201: UserBatchSerializer, 400: 'Invalid input'}
    )
    def post(self, request):
        try:
            serializer = UserBatchSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserBatchDetailAPIView(APIView):

    permission_classes = [AllowAny] #Todo: Authenticate to ISauth


    @swagger_auto_schema(
        operation_description="Retrieve a user batch by ID",
        responses={
            200: UserBatchSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            user_batch = UserBatch.objects.get(pk=pk)
            serializer = UserBatchSerializer(user_batch)
            return Response(serializer.data)
        except UserBatch.DoesNotExist:
            return Response({'error': 'UserBatch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update a user batch by ID",
        request_body=UserBatchSerializer,
        responses={
            200: UserBatchSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            user_batch = UserBatch.objects.get(pk=pk)
            serializer = UserBatchSerializer(user_batch, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserBatch.DoesNotExist:
            return Response({'error': 'UserBatch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a user batch by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            user_batch = UserBatch.objects.get(pk=pk)
            user_batch.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserBatch.DoesNotExist:
            return Response({'error': 'UserBatch not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BatchUserListAPIView(APIView):

    permission_classes = [AllowAny]

    @swagger_auto_schema(
        tags=['batches'],
        operation_description="List all users of a batch",
        responses={200: UserBatchSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get_users(self, request, batch_id):
        try:
            user_batches = UserBatch.objects.filter(batch_id=batch_id)
            serializer = UserBatchSerializer(user_batches, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    @swagger_auto_schema(
        tags=['users'],
        operation_description="List all batches of a user",
        responses={200: UserBatchSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get_batches(self, request, user_id):
        try:
            user_batches = UserBatch.objects.filter(user_id=user_id)
            serializer = UserBatchSerializer(user_batches, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        tags=['batches-users-list',],
        manual_parameters=[
            openapi.Parameter('batch_id', openapi.IN_QUERY, description="ID of the batch", type=openapi.TYPE_INTEGER),
            openapi.Parameter('user_id', openapi.IN_QUERY, description="ID of the user", type=openapi.TYPE_INTEGER)
        ],
        responses={
            200: UserBatchSerializer(many=True), 
            400: openapi.Response(description='Bad Request'), 
            500: openapi.Response(description='Internal Server Error')
        },
        operation_description="List users of a batch or batches of a user based on the provided query parameter"
    )
    def get(self, request, *args, **kwargs):
        batch_id = request.query_params.get('batch_id')
        user_id = request.query_params.get('user_id')
        
        if batch_id and user_id:
            return Response({'error': 'Only one of batch_id or user_id should be provided'}, status=status.HTTP_400_BAD_REQUEST)
        elif not batch_id and not user_id:
            return Response({'error': 'Either batch_id or user_id must be provided'}, status=status.HTTP_400_BAD_REQUEST)
        elif batch_id:
            return self.get_users(request, batch_id)
        elif user_id:
            return self.get_batches(request, user_id)
        

class ActivityListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all activities",
        responses={200: ActivitySerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            activities = Activity.objects.all()
            serializer = ActivitySerializer(activities, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new activity",
        request_body=ActivitySerializer,
        responses={
            201: ActivitySerializer,
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = ActivitySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ActivityDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve a activity by ID",
        responses={
            200: ActivitySerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            activity = Activity.objects.get(pk=pk)
            serializer = ActivitySerializer(activity)
            return Response(serializer.data)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update an activity by ID",
        request_body=ActivitySerializer,
        responses={
            200: ActivitySerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):     #TODO: Upon update, shouldn't be able to change Batch FK
        try:
            activity = Activity.objects.get(pk=pk)
            serializer = ActivitySerializer(activity, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete an activity by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            activity = Activity.objects.get(pk=pk)
            activity.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserActivityListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all user activities",
        responses={200: UserActivitySerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            user_activities = UserActivity.objects.all()
            serializer = UserActivitySerializer(user_activities, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new user activity",
        request_body=UserActivitySerializer,
        responses={
            201: UserActivitySerializer, 
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = UserActivitySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UserActivityDetailAPIView(APIView):
    permission_classes = [AllowAny]  # Todo: Authenticate to ISauth

    @swagger_auto_schema(
        operation_description="Retrieve a user activity by ID",
        responses={
            200: UserActivitySerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            user_activity = UserActivity.objects.get(pk=pk)
            serializer = UserActivitySerializer(user_activity)
            return Response(serializer.data)
        except UserActivity.DoesNotExist:
            return Response({'error': 'UserActivity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update a user activity by ID",
        request_body=UserActivitySerializer,
        responses={
            200: UserActivitySerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            user_activity = UserActivity.objects.get(pk=pk)
            serializer = UserActivitySerializer(user_activity, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserActivity.DoesNotExist:
            return Response({'error': 'UserActivity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a user activity by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            user_activity = UserActivity.objects.get(pk=pk)
            user_activity.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserActivity.DoesNotExist:
            return Response({'error': 'UserActivity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CardListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all cards",
        responses={200: CardSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            cards = Card.objects.all()
            serializer = CardSerializer(cards, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new card",
        request_body=CardSerializer,
        responses={
            201: CardSerializer,
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = CardSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CardDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve a card by ID",
        responses={
            200: CardSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            card = Card.objects.get(pk=pk)
            serializer = CardSerializer(card)
            return Response(serializer.data)
        except Card.DoesNotExist:
            return Response({'error': 'Card not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update an card by ID",
        request_body=CardSerializer,
        responses={
            200: CardSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):     #TODO: Upon update, shouldn't be able to change Batch FK
        try:
            card = Card.objects.get(pk=pk)
            serializer = CardSerializer(card, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Card.DoesNotExist:
            return Response({'error': 'Card not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete an card by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            card = Card.objects.get(pk=pk)      #TODO: Mark all delete views as inactive=true, add a field
            card.delete()       #TODO: Return the deleted object instead of None
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Card.DoesNotExist:
            return Response({'error': 'Card not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserCardListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all user card",
        responses={200: UserCardSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            user_cards = UserCard.objects.all()
            serializer = UserCardSerializer(user_cards, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new user card",
        request_body=UserCardSerializer,
        responses={
            201: UserCardSerializer, 
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = UserCardSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserCardDetailAPIView(APIView):
    permission_classes = [AllowAny]  # Todo: Authenticate to ISauth

    @swagger_auto_schema(
        operation_description="Retrieve a user card by ID",
        responses={
            200: UserCardSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            user_card = UserCard.objects.get(pk=pk)
            serializer = UserCardSerializer(user_card)
            return Response(serializer.data)
        except UserCard.DoesNotExist:
            return Response({'error': 'UserCard not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update a user card by ID",
        request_body=UserCardSerializer,
        responses={
            200: UserCardSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            user_card = UserCard.objects.get(pk=pk)
            serializer = UserCardSerializer(user_card, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserCard.DoesNotExist:
            return Response({'error': 'UserCard not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a user card by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            user_card = UserCard.objects.get(pk=pk)
            user_card.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserCard.DoesNotExist:
            return Response({'error': 'UserCard not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class QuestionListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all questions",
        responses={200: QuestionSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            questions = Question.objects.all()
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new question",
        request_body=QuestionSerializer,
        responses={
            201: QuestionSerializer,
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = QuestionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuestionDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve a question by ID",
        responses={
            200: QuestionSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
            serializer = QuestionSerializer(question)
            return Response(serializer.data)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update a question by ID",
        request_body=QuestionSerializer,
        responses={
            200: QuestionSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
            serializer = QuestionSerializer(question, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a question by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
            question.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class OptionListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all options",
        responses={200: OptionSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            options = Option.objects.all()
            serializer = OptionSerializer(options, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new option",
        request_body=OptionSerializer,
        responses={
            201: OptionSerializer,
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = OptionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OptionDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve an option by ID",
        responses={
            200: OptionSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            option = Option.objects.get(pk=pk)
            serializer = OptionSerializer(option)
            return Response(serializer.data)
        except Option.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update an option by ID",
        request_body=OptionSerializer,
        responses={
            200: OptionSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            option = Option.objects.get(pk=pk)
            serializer = OptionSerializer(option, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Option.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete an option by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            option = Option.objects.get(pk=pk)
            option.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Option.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class AnswerListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="List all answers",
        responses={200: AnswerSerializer(many=True), 500: openapi.Response(description='Internal Server Error')}
    )
    def get(self, request):
        try:
            answers = Answer.objects.all()
            serializer = AnswerSerializer(answers, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Create a new answer",
        request_body=AnswerSerializer,
        responses={
            201: AnswerSerializer,
            400: openapi.Response(description='Invalid input'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def post(self, request):
        try:
            serializer = AnswerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()

                # Check if all questions in the card are answered
                # question = serializer.instance.question
                # card = question.card
                # questions_in_card = card.questions.all()
                
                # user_answers = Answer.objects.filter(
                #     user=serializer.instance.user, 
                #     question__in=questions_in_card
                # ).distinct('question').count()

                # if user_answers == questions_in_card.count():
                #     user_card = UserCard.objects.get(user=serializer.instance.user, card=card)
                #     user_card.completed_questions = user_answers
                #     user_card.save(update_fields=['completed_questions'])

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AnswerDetailAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve an answer by ID",
        responses={
            200: AnswerSerializer,
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def get(self, request, pk):
        try:
            answer = Answer.objects.get(pk=pk)
            serializer = AnswerSerializer(answer)
            return Response(serializer.data)
        except Answer.DoesNotExist:
            return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update an answer by ID",
        request_body=AnswerSerializer,
        responses={
            200: AnswerSerializer,
            400: openapi.Response(description='Invalid input'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def put(self, request, pk):
        try:
            answer = Answer.objects.get(pk=pk)
            serializer = AnswerSerializer(answer, data=request.data)
            if serializer.is_valid():
                serializer.save()

                # Check if all questions in the card are answered
                # question = serializer.instance.question
                # card = question.card
                # questions_in_card = card.questions.all()

                # user_answers = Answer.objects.filter(
                #     user=serializer.instance.user, 
                #     question__in=questions_in_card
                # ).distinct('question').count()

                # if user_answers == questions_in_card.count():
                #     user_card = UserCard.objects.get(user=serializer.instance.user, card=card)
                #     user_card.completed_questions = user_answers
                #     user_card.save(update_fields=['completed_questions'])

                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Answer.DoesNotExist:
            return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete an answer by ID",
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found'),
            500: openapi.Response(description='Internal Server Error')
        }
    )
    def delete(self, request, pk):
        try:
            answer = Answer.objects.get(pk=pk)
            answer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Answer.DoesNotExist:
            return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


