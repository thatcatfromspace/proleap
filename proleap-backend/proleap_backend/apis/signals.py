
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserBatch, Status


# User's Activity Status 
@receiver(post_save, sender=UserBatch)
def update_status(sender, instance, **kwargs):
    if instance.completed_activities == 0:
        instance.status = Status.NOT_ATTEMPTED
    elif 0 < instance.completed_activities < instance.batch.total_activities:
        instance.status = Status.IN_PROGRESS
    elif instance.completed_activities >= instance.batch.total_activities:
        instance.status = Status.COMPLETED

    instance.save(update_fields=['status'])