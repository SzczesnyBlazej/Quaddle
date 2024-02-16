# Generated by Django 5.0.1 on 2024-01-22 18:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('task_options', '0001_initial'),
        ('tasks', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='favorites',
            name='user_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='message',
            name='client_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='messages_as_client', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='message',
            name='message_sender',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='messages_as_sender', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='notification',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='task',
            name='client_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tasks_as_client', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='task',
            name='difficulty',
            field=models.ForeignKey(blank=True, limit_choices_to={'title': 'Difficulty'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='difficulty_tasks', to='task_options.taskoptions'),
        ),
        migrations.AddField(
            model_name='task',
            name='priority',
            field=models.ForeignKey(blank=True, limit_choices_to={'title': 'Priority'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='priority_tasks', to='task_options.taskoptions'),
        ),
        migrations.AddField(
            model_name='task',
            name='solver',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tasks_as_solver', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='task',
            name='status',
            field=models.ForeignKey(blank=True, limit_choices_to={'title': 'Status'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='status_tasks', to='task_options.taskoptions'),
        ),
        migrations.AddField(
            model_name='task',
            name='unit',
            field=models.ForeignKey(blank=True, limit_choices_to={'title': 'Unit'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='units_tasks', to='task_options.taskoptions'),
        ),
        migrations.AddField(
            model_name='notification',
            name='task_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='tasks.task'),
        ),
        migrations.AddField(
            model_name='message',
            name='task_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='tasks.task'),
        ),
        migrations.AddField(
            model_name='favorites',
            name='favorites_tasks_id',
            field=models.ManyToManyField(related_name='favorited_by', to='tasks.task'),
        ),
    ]
