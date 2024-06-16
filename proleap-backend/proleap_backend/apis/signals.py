from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.utils import IntegrityError
from .models import UserBatch, Status

@receiver(post_save, sender=UserBatch)
def update_status(sender, instance, created, **kwargs):
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

        # Check if status or is_completed fields are updated
        if kwargs.get('update_fields') is None or 'completed_activities' in kwargs['update_fields']:
            instance.save(update_fields=['status', 'is_completed'])

    except IntegrityError as e:
        print(f"IntegrityError occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
