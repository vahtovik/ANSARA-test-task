# Generated by Django 5.0.3 on 2024-04-04 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0021_alter_tasklist_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasklist',
            name='completed_task_end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='tasklist',
            name='completed_task_start_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
