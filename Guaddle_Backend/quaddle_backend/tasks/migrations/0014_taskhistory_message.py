# Generated by Django 5.0.1 on 2024-06-22 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0013_alter_recentlyviewedtasks_recently_viewed_tasks_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskhistory',
            name='message',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
