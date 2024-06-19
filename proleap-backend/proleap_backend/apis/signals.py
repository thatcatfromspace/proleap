from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.utils import IntegrityError
from django.db import transaction
from .models import UserBatch, Status, Activity, UserActivity, Card, UserCard, Question, Answer
import logging

logger = logging.getLogger(__name__)


# Signal for User's Batch progress
# @receiver(post_save, sender=UserBatch)
# def update_user_batch_status(sender, instance, created, **kwargs):
#     try:
#         if created:
#             # Only update status on creation if not already set
#             if instance.completed_activities == 0:
#                 instance.status = Status.NOT_ATTEMPTED
#             elif 0 < instance.completed_activities < instance.batch.total_activities:
#                 instance.status = Status.IN_PROGRESS
#         else:
#             # Update status on update if necessary
#             if instance.completed_activities == 0:
#                 instance.status = Status.NOT_ATTEMPTED
#             elif 0 < instance.completed_activities < instance.batch.total_activities:
#                 instance.status = Status.IN_PROGRESS
#             elif instance.completed_activities >= instance.batch.total_activities:
#                 instance.status = Status.COMPLETED
#                 instance.is_completed = True

#         # Check if completed_activitiies field is updated
#         if kwargs.get('update_fields') is None or 'completed_activities' in kwargs['update_fields']:
#             instance.save(update_fields=['status', 'is_completed'])

#     except IntegrityError as e:
#         print(f"IntegrityError occurred: {e}")
#     except Exception as e:
#         print(f"An error occurred: {e}")


# Signal for User's Activity progress with UserBatch completed_card's count
# @receiver(post_save, sender=UserActivity)
# def update_user_activity_status(sender, instance, created, **kwargs):
#     try:
#         if created:
#             # Only update status on creation if not already set
#             if instance.completed_cards == 0:
#                 instance.status = Status.NOT_ATTEMPTED
#             elif 0 < instance.completed_cards < instance.activity.total_cards:
#                 instance.status = Status.IN_PROGRESS
#         else:
#             # Update status on update if necessary
#             if instance.completed_cards == 0:
#                 instance.status = Status.NOT_ATTEMPTED
#             elif 0 < instance.completed_cards < instance.activity.total_cards:
#                 instance.status = Status.IN_PROGRESS
#             elif instance.completed_cards >= instance.activity.total_cards:
#                 instance.status = Status.COMPLETED

#         # Check if completed_cards field is updated
#         if kwargs.get('update_fields') is None or 'completed_cards' in kwargs['update_fields']:  #TODO: Make this and above if statement check as one if statement
#             instance.save(update_fields=['status'])
        
#         # Fetch all activities for the batch of the current activity
#         activities_in_batch = Activity.objects.filter(batch=instance.activity.batch)
        
#         # Fetch all UserActivity for the user and the activities in the batch
#         user_activities_in_batch = UserActivity.objects.filter(user=instance.user, activity__in=activities_in_batch)
        
#         # Count the number of activities completed by the user in the batch
#         completed_activities_count = user_activities_in_batch.filter(status=Status.COMPLETED).count()
        
#         # Fetch the UserBatch instance
#         user_batch = UserBatch.objects.get(user=instance.user, batch=instance.activity.batch)
        
#         # Update the completed_activities count in UserBatch
#         user_batch.completed_activities = completed_activities_count
        
#         # Save the UserBatch instance
#         user_batch.save(update_fields=['completed_activities'])

#     except UserBatch.DoesNotExist:
#         print(f"UserBatch instance for user {instance.user.id} and batch {instance.activity.batch.id} does not exist.")
#     except IntegrityError as e:
#         print(f"IntegrityError occurred: {e}")
#     except Exception as e:
#         print(f"An error occurred: {e}")


# Signal for User's Card progress with UserActivity completed_question's count
# @receiver(post_save, sender=UserCard)
# def update_user_card_status(sender, instance, created, **kwargs):
#     try:
#         if created:
#             # Only update status on creation if not already set
#             if instance.completed_questions == 0:
#                 instance.status = Status.NOT_ATTEMPTED
#             elif 0 < instance.completed_questions < instance.card.total_questions:
#                 instance.status = Status.IN_PROGRESS
#         else:
#             # Update status on update if necessary
#             if instance.completed_questions == 0:
#                 instance.status = Status.NOT_ATTEMPTED
#             elif 0 < instance.completed_questions < instance.card.total_questions:
#                 instance.status = Status.IN_PROGRESS
#             elif instance.completed_questions >= instance.card.total_questions:
#                 instance.status = Status.COMPLETED

#         # Check if completed_questions field is updated
#         if kwargs.get('update_fields') is None or 'completed_questions' in kwargs['update_fields']:
#             instance.save(update_fields=['status'])

#         # Fetch all cards for the activity of the current card
#         cards_in_activity = instance.card.activity.cards.all()
        
#         # Fetch all UserCard for the user and the cards in the activity
#         user_cards_in_activity = UserCard.objects.filter(user=instance.user, card__in=cards_in_activity)
        
#         # Count the number of cards completed by the user in the activity
#         completed_cards_count = user_cards_in_activity.filter(status=Status.COMPLETED).count()
        
#         # Fetch the UserActivity instance
#         user_activity = UserActivity.objects.get(user=instance.user, activity=instance.card.activity)
        
#         # Update the completed_cards count in UserActivity
#         user_activity.completed_cards = completed_cards_count
        
#         # Save the UserActivity instance
#         user_activity.save(update_fields=['completed_cards'])

#     except UserActivity.DoesNotExist:
#         print(f"UserActivity instance for user {instance.user.id} and activity {instance.card.activity.id} does not exist.")
#     except IntegrityError as e:
#         print(f"IntegrityError occurred: {e}")
#     except Exception as e:
#         print(f"An error occurred: {e}")



# Signal for User's Question progress with UserCard answers's count
# @receiver(post_save, sender=Answer)
# def update_user_question_status(sender, instance, created, **kwargs):
#     try:
#         question = instance.question
#         card = question.card
#         user = instance.user

#         # Fetch all questions in the card
#         questions_in_card = Question.objects.filter(card=card)
#         question_ids = questions_in_card.values_list('id', flat=True)

#         # Fetch all unique answers for the user and questions in the card (consider checkbox questions as one)
#         user_answers = Answer.objects.filter(user=user, question__in=question_ids).values('question').distinct()

#         # Count the number of questions answered by the user in the card
#         completed_questions_count = user_answers.count()

#         # Fetch the UserCard instance
#         user_card, created = UserCard.objects.get_or_create(user=user, card=card)

#         # Update the completed_questions count in UserCard
#         user_card.completed_questions = completed_questions_count

#         # Update the status in UserCard
#         if completed_questions_count == 0:
#             user_card.status = Status.NOT_ATTEMPTED
#         elif 0 < completed_questions_count < card.total_questions:
#             user_card.status = Status.IN_PROGRESS
#         elif completed_questions_count >= card.total_questions:
#             user_card.status = Status.COMPLETED

#         # Save the UserCard instance
#         user_card.save(update_fields=['completed_questions', 'status'])

#     except UserCard.DoesNotExist:
#         print(f"UserCard instance for user {user.id} and card {card.id} does not exist.")
#     except IntegrityError as e:
#         print(f"IntegrityError occurred: {e}")
#     except Exception as e:
#         print(f"An error occurred: {e}")


# # Signal for UserActivity Creation
# @receiver(post_save, sender=Activity)
# def create_user_activities(sender, instance, created, **kwargs):
#     if created and instance.batch:  # Check if the activity is newly created and has an associated batch
#         # Fetch all users in the batch
#         users_in_batch = instance.batch.users.all()

#         # Create UserActivity for each user in the batch
#         user_activities = [
#             UserActivity(user=user, activity=instance)
#             for user in users_in_batch
#         ]

#         # Bulk create UserActivity instances
#         UserActivity.objects.bulk_create(user_activities)


# # Signal for UserCard Creation
# @receiver(post_save, sender=Card)
# def create_user_cards(sender, instance, created, **kwargs):
#     if created and instance.activity:  # Check if the card is newly created and has an associated activity
#         # Fetch all users in the activity
#         users_in_activity = instance.activity.users.all()

#         # Create UserCard for each user in the activity
#         user_cards = [
#             UserCard(user=user, card=instance)
#             for user in users_in_activity
#         ]

#         # Bulk create UserCard instances
#         UserCard.objects.bulk_create(user_cards)


# Signal to create UserActivity and UserCard when a UserBatch is created. 
# @receiver(post_save, sender=UserBatch)
# def create_user_activities_and_cards(sender, instance, created, **kwargs):
#     if created:
#         try:
#             # Ensure atomic transactions to maintain data integrity
#             with transaction.atomic():
#                 # Fetch all activities in the batch
#                 activities_in_batch = Activity.objects.filter(batch=instance.batch)

#                 # Create UserActivity for each activity in the batch
#                 user_activities = [
#                     UserActivity(user=instance.user, activity=activity)
#                     for activity in activities_in_batch
#                 ]
#                 UserActivity.objects.bulk_create(user_activities)

#                 # For each activity, fetch the cards and create UserCard instances
#                 for activity in activities_in_batch:
#                     cards_in_activity = Card.objects.filter(activity=activity)
#                     user_cards = [
#                         UserCard(user=instance.user, card=card)
#                         for card in cards_in_activity
#                     ]
#                     UserCard.objects.bulk_create(user_cards)

#                     # For each card, fetch the questions and create UserCard instances for each question
#                     # for card in cards_in_activity:
#                     #     questions_in_card = Question.objects.filter(card=card)
#                     #     user_answers = [
#                     #         Answer(user=instance.user, question=question)
#                     #         for question in questions_in_card
#                     #     ]
#                     #     Answer.objects.bulk_create(user_answers)

#         except IntegrityError as e:
#             print(f"IntegrityError occurred: {e}")
#         except Exception as e:
#             print(f"An error occurred: {e}")


@receiver(post_save, sender=Answer)
def update_user_progress(sender, instance, created, **kwargs):
    try:
        question = instance.question
        card = question.card
        user = instance.user

        # Fetch all questions in the card
        questions_in_card = Question.objects.filter(card=card)
        question_ids = questions_in_card.values_list('id', flat=True)

        # Fetch all unique answers for the user and questions in the card
        user_answers = Answer.objects.filter(user=user, question__in=question_ids).values('question').distinct()
        completed_questions_count = user_answers.count()

        # Update the UserCard instance
        user_card, created = UserCard.objects.get_or_create(user=user, card=card)
        user_card.completed_questions = completed_questions_count

        # Update the status in UserCard
        if completed_questions_count == 0:
            user_card.status = Status.NOT_ATTEMPTED
        elif completed_questions_count < card.total_questions:
            user_card.status = Status.IN_PROGRESS
        else:
            user_card.status = Status.COMPLETED

        user_card.save(update_fields=['completed_questions', 'status'])
        # print(f"UserCard updated: {user_card.status}, {user_card.completed_questions}")
        logger.info(f"UserCard updated: {user_card.status}, {user_card.completed_questions}")


        # Fetch all cards for the activity of the current card
        cards_in_activity = Card.objects.filter(activity=card.activity)
        card_ids = cards_in_activity.values_list('id', flat=True)
        user_cards_in_activity = UserCard.objects.filter(user=user, card__in=card_ids)
        completed_cards_count = user_cards_in_activity.filter(status=Status.COMPLETED).count()

        # Update the UserActivity instance
        user_activity, created = UserActivity.objects.get_or_create(user=user, activity=card.activity)
        user_activity.completed_cards = completed_cards_count

        if completed_cards_count == 0:
            user_activity.status = Status.NOT_ATTEMPTED
        elif completed_cards_count < card.activity.total_cards:
            user_activity.status = Status.IN_PROGRESS
        else:
            user_activity.status = Status.COMPLETED

        user_activity.save(update_fields=['completed_cards', 'status'])
        # print(f"UserActivity updated: {user_activity.status}, {user_activity.completed_cards}")
        logger.info(f"UserActivity updated: {user_activity.status}, {user_activity.completed_cards}")


        # Fetch all activities for the batch of the current activity
        activities_in_batch = Activity.objects.filter(batch=card.activity.batch)
        activity_ids = activities_in_batch.values_list('id', flat=True)
        user_activities_in_batch = UserActivity.objects.filter(user=user, activity__in=activity_ids)
        completed_activities_count = user_activities_in_batch.filter(status=Status.COMPLETED).count()

        # Update the UserBatch instance
        user_batch = UserBatch.objects.get(user=user, batch=card.activity.batch)
        user_batch.completed_activities = completed_activities_count

        if completed_activities_count == 0:
            user_batch.status = Status.NOT_ATTEMPTED
        elif completed_activities_count < card.activity.batch.total_activities:
            user_batch.status = Status.IN_PROGRESS
        else:
            user_batch.status = Status.COMPLETED
            user_batch.is_completed = True

        user_batch.save(update_fields=['completed_activities', 'status', 'is_completed'])
        # print(f"UserBatch updated: {user_batch.status}, {user_batch.completed_activities}")
        logger.info(f"UserBatch updated: {user_batch.status}, {user_batch.completed_activities}")


    except UserCard.DoesNotExist:
        print(f"UserCard instance for user {user.id} and card {card.id} does not exist.")
    except UserActivity.DoesNotExist:
        print(f"UserActivity instance for user {user.id} and activity {card.activity.id} does not exist.")
    except UserBatch.DoesNotExist:
        print(f"UserBatch instance for user {user.id} and batch {card.activity.batch.id} does not exist.")
    except IntegrityError as e:
        print(f"IntegrityError occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


