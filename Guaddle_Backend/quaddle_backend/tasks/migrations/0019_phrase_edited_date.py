# Generated by Django 5.0.1 on 2024-07-10 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0018_alter_phrase_create_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='phrase',
            name='edited_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
