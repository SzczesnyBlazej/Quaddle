# Generated by Django 5.0.1 on 2024-01-22 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicationConfig',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('enable', models.BooleanField()),
                ('value', models.CharField(max_length=10)),
                ('description', models.TextField()),
                ('title', models.CharField(default='NONE', max_length=255)),
            ],
        ),
    ]
