from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.utils import IntegrityError
from .models import UserBatch, Status, Activity, UserActivity

# Signal for User's Batch progress
@receiver(post_save, sender=UserBatch)
def update_user_batch_status(sender, instance, created, **kwargs):
    try:
        if created:
            # Only update status on creation if not already set
            if instance.completed_activities == 0:
                instance.status = Status.NOT_ATTEMPTED
            elif 0 < instance.completed_activities < instance.batch.total_activities:
                instance.status = Status.IN_PROGRESS
        else:
            # Update status on update if necessary
            if instance.completed_activities == 0:
                instance.status = Status.NOT_ATTEMPTED
            elif 0 < instance.completed_activities < instance.batch.total_activities:
                instance.status = Status.IN_PROGRESS
            elif instance.completed_activities >= instance.batch.total_activities:
                instance.status = Status.COMPLETED
                instance.is_completed = True

        # Check if completed_activitiies field is updated
        if kwargs.get('update_fields') is None or 'completed_activities' in kwargs['update_fields']:
            instance.save(update_fields=['status', 'is_completed'])

    except IntegrityError as e:
        print(f"IntegrityError occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Signal for User's Activity progress with UserBatch completed_card's count
@receiver(post_save, sender=UserActivity)
def update_user_activity_status(sender, instance, created, **kwargs):
    try:
        if created:
            # Only update status on creation if not already set
            if instance.completed_cards == 0:
                instance.status = Status.NOT_ATTEMPTED
            elif 0 < instance.completed_cards < instance.activity.total_cards:
                instance.status = Status.IN_PROGRESS
        else:
            # Update status on update if necessary
            if instance.completed_cards == 0:
                instance.status = Status.NOT_ATTEMPTED
            elif 0 < instance.completed_cards < instance.activity.total_cards:
                instance.status = Status.IN_PROGRESS
            elif instance.completed_cards >= instance.activity.total_cards:
                instance.status = Status.COMPLETED

        # Check if completed_cards field is updated
        if kwargs.get('update_fields') is None or 'completed_cards' in kwargs['update_fields']:  #TODO: Make this and above if statement check as one if statement
            instance.save(update_fields=['status'])
        
        # Fetch all activities for the batch of the current activity
        activities_in_batch = Activity.objects.filter(batch=instance.activity.batch)
        
        # Fetch all UserActivity for the user and the activities in the batch
        user_activities_in_batch = UserActivity.objects.filter(user=instance.user, activity__in=activities_in_batch)
        
        # Count the number of activities completed by the user in the batch
        completed_activities_count = user_activities_in_batch.filter(status=Status.COMPLETED).count()
        
        # Fetch the UserBatch instance
        user_batch = UserBatch.objects.get(user=instance.user, batch=instance.activity.batch)
        
        # Update the completed_activities count in UserBatch
        user_batch.completed_activities = completed_activities_count
        
        # Save the UserBatch instance
        user_batch.save(update_fields=['completed_activities'])

    except UserBatch.DoesNotExist:
        print(f"UserBatch instance for user {instance.user.id} and batch {instance.activity.batch.id} does not exist.")
    except IntegrityError as e:
        print(f"IntegrityError occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


# Signal for UserActivity Creation
@receiver(post_save, sender=Activity)
def create_user_activities(sender, instance, created, **kwargs):
    if created and instance.batch:  # Check if the activity is newly created and has an associated batch
        # Fetch all users in the batch
        users_in_batch = instance.batch.users.all()

        # Create UserActivity for each user in the batch
        user_activities = [
            UserActivity(user=user, activity=instance)
            for user in users_in_batch
        ]

        # Bulk create UserActivity instances
        UserActivity.objects.bulk_create(user_activities)


