# Generated by Django 5.0.6 on 2024-06-18 11:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=256)),
                ('sequence_no', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.CharField(blank=True, max_length=500, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_answers', to=settings.AUTH_USER_MODEL)),
                ('option', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='apis.option')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=512)),
                ('type', models.CharField(choices=[('SHORT_ANSWER', 'short_answer'), ('PARAGRAPH', 'paragraph'), ('NUMBER', 'number'), ('RADIO', 'radio'), ('DATE', 'date'), ('MULTIPLE_CHOICE', 'multiple_choice'), ('FILE', 'file'), ('CHECKBOXES', 'checkboxes'), ('URL', 'url'), ('IMAGE', 'image'), ('TIME', 'time'), ('EMAIL', 'email')], default='SHORT_ANSWER', max_length=64)),
                ('desc', models.CharField(blank=True, max_length=256, null=True)),
                ('is_required', models.BooleanField(default=True)),
                ('sequence_no', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('card', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='apis.card')),
                ('users', models.ManyToManyField(related_name='user_questions', through='apis.Answer', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='option',
            name='question',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='options', to='apis.question'),
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='apis.question'),
        ),
        migrations.AddConstraint(
            model_name='question',
            constraint=models.UniqueConstraint(fields=('card', 'sequence_no'), name='unique_card_sequence_no'),
        ),
        migrations.AddConstraint(
            model_name='option',
            constraint=models.UniqueConstraint(fields=('question', 'sequence_no'), name='unique_question_sequence_no'),
        ),
        migrations.AlterUniqueTogether(
            name='answer',
            unique_together={('user', 'question', 'option')},
        ),
    ]
