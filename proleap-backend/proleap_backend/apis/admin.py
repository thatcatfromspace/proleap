from django.contrib import admin

from .models import (
    User,
    Batch, UserBatch,
    Activity, UserActivity,
    Card, UserCard,
    Question, Option, Answer
)

# Register your models here.

admin.site.register(User)
admin.site.register(Batch)
admin.site.register(UserBatch)
admin.site.register(Activity)
admin.site.register(UserActivity)
admin.site.register(Card)
admin.site.register(UserCard)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Answer)
