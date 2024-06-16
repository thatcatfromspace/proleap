from django.urls import path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .views import (
   UserListAPIView, UserDetailAPIView, SignInAPIView, BatchListCreateAPIView, 
   BatchDetailAPIView, UserBatchListCreateAPIView, UserBatchDetailAPIView
)

schema_view = get_schema_view(
   openapi.Info(
      title="ProLeap API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="proleap.ewhiz@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [

   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

   # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),    #TODO: Fix why token pair wont work
   path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('signin/', SignInAPIView.as_view(), name='auth'),

   path('users/', UserListAPIView.as_view(), name='users'),
   path('users/<int:id>/', UserDetailAPIView.as_view(), name='users'),

   path('batches/', BatchListCreateAPIView.as_view(), name='batch-list-create'),
   path('batches/<int:pk>/', BatchDetailAPIView.as_view(), name='batch-detail'),

   path('userbatches/', UserBatchListCreateAPIView.as_view(), name='user-batch-list-create'),
   path('userbatches/<int:pk>/', UserBatchDetailAPIView.as_view(), name='user-batch-detail'),

]
