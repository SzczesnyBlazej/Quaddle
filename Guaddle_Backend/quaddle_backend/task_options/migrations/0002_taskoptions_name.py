# Generated by Django 5.0.1 on 2024-05-08 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_options', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskoptions',
            name='name',
            field=models.CharField(default='', max_length=50),
        ),
    ]
