# Generated by Django 5.0.1 on 2024-05-08 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_options', '0005_alter_taskoptions_advice_alter_taskoptions_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskoptions',
            name='advice',
            field=models.CharField(blank=True, default='No information available', max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='taskoptions',
            name='name',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
    ]
