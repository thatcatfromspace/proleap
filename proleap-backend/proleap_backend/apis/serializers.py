from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError


from .models import (
    User, Batch, UserBatch, Status,
    Activity, UserActivity,
    Card, UserCard,
)

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
    user_id = serializers.IntegerField()
    batch_id = serializers.IntegerField()

    class Meta:
        model = UserBatch
        fields = ['id', 'user_id', 'batch_id', 'completed_activities', 'is_completed', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        batch_id = validated_data.pop('batch_id')

        try:
            user_batch, created = UserBatch.objects.update_or_create(
                user_id=user_id,
                batch_id=batch_id,
                defaults={
                    'completed_activities': validated_data.get('completed_activities', 0),
                    'is_completed': validated_data.get('is_completed', False),
                    'status': validated_data.get('status', Status.NOT_ATTEMPTED)
                }
            )
            return user_batch
        except Exception as e:
            raise serializers.ValidationError(str(e))
        
    def update(self, instance, validated_data):
        # Exclude user_id and batch_id from validated_data to keep them immutable
        validated_data.pop('user_id', None)
        validated_data.pop('batch_id', None)

        instance.completed_activities = validated_data.get('completed_activities', instance.completed_activities)
        instance.is_completed = validated_data.get('is_completed', instance.is_completed)
        instance.status = validated_data.get('status', instance.status)

        try:
            instance.save()
            return instance
        except Exception as e:
            raise serializers.ValidationError(str(e))


class ActivitySerializer(serializers.ModelSerializer):
    # user_activities = UserActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'name', 'desc', 'start_time', 'end_time',
                  'total_cards', 'total_polling_cards',
                  'created_at', 'updated_at', 'batch', 'sequence_no',
                ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserActivitySerializer(serializers.ModelSerializer):
    activity_id = serializers.IntegerField()
    user_id = serializers.IntegerField()

    class Meta:
        model = UserActivity
        fields = ['id', 'activity_id', 'user_id', 'completed_cards', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        activity_id = validated_data.pop('activity_id')
        user_id = validated_data.pop('user_id')

        try:
            user_activity, created = UserActivity.objects.update_or_create(
                activity_id=activity_id,
                user_id=user_id,
                defaults={
                    'completed_cards': validated_data.get('completed_cards', 0),
                    'status': validated_data.get('status', Status.NOT_ATTEMPTED)
                }
            )
            return user_activity
        except Exception as e:
            raise serializers.ValidationError(str(e))

    def update(self, instance, validated_data):
        # Exclude activity_id and user_id from validated_data to keep them immutable
        validated_data.pop('activity_id', None) #TODO: Throw an error if not FKs arent't same
        validated_data.pop('user_id', None)

        instance.completed_cards = validated_data.get('completed_cards', instance.completed_cards)
        instance.status = validated_data.get('status', instance.status)

        try:
            instance.save()
            return instance
        except Exception as e:
            raise serializers.ValidationError(str(e))


class CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ['id', 'name', 'desc', 'type', 'to_be_shown', 'start_time', 'end_time', 'duration',
                  'total_questions', 'created_at', 'updated_at', 'activity', 'sequence_no',
                ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCardSerializer(serializers.ModelSerializer):
    card_id = serializers.IntegerField()
    user_id = serializers.IntegerField()

    class Meta:
        model = UserCard
        fields = ['id', 'card_id', 'user_id', 'completed_questions', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        card_id = validated_data.pop('card_id')
        user_id = validated_data.pop('user_id')

        try:
            user_card, created = UserCard.objects.update_or_create(
                card_id=card_id,
                user_id=user_id,
                defaults={
                    'completed_questions': validated_data.get('completed_questions', 0),
                    'status': validated_data.get('status', Status.NOT_ATTEMPTED)
                }
            )
            return user_card
        except Exception as e:
            raise serializers.ValidationError(str(e))

    def update(self, instance, validated_data):
        # Exclude card_id and user_id from validated_data to keep them immutable
        validated_data.pop('card_id', None) #TODO: Throw an error if not FKs arent't same
        validated_data.pop('user_id', None)

        instance.completed_questions = validated_data.get('completed_questions', instance.completed_questions)
        instance.status = validated_data.get('status', instance.status)

        try:
            instance.save()
            return instance
        except Exception as e:
            raise serializers.ValidationError(str(e))
        
