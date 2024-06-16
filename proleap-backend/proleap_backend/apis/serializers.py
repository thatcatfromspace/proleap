from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


from .models import (User, Batch, UserBatch)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class BatchSerializer(serializers.ModelSerializer):
    # users = UserSerializer(many=True, read_only=True, source='users_set')
    class Meta:
        model = Batch
        fields = '__all__'


class UserBatchSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    batch = BatchSerializer(read_only=True)

    class Meta:
        model = UserBatch
        fields = '__all__'