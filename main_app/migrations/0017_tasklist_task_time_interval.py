# Generated by Django 5.0.3 on 2024-03-12 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0016_tasklist_completed_task_end_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tasklist',
            name='task_time_interval',
            field=models.DateTimeField(null=True),
        ),
    ]
