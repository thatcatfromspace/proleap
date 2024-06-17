from django.contrib import admin

from .models import (
    User, 
    Batch, UserBatch, 
    Activity, UserActivity,
)

# Register your models here.

admin.site.register(User)
admin.site.register(Batch)
admin.site.register(UserBatch)
admin.site.register(Activity)
admin.site.register(UserActivity)
