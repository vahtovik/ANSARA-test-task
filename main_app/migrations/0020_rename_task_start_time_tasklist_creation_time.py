# Generated by Django 5.0.3 on 2024-03-16 15:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0019_alter_tasklist_order'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tasklist',
            old_name='task_start_time',
            new_name='creation_time',
        ),
    ]
