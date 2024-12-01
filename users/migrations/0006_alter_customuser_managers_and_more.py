# Generated by Django 5.1.2 on 2024-11-30 22:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_alter_customuser_is_active"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="customuser",
            managers=[],
        ),
        migrations.AlterField(
            model_name="customuser",
            name="phone_number",
            field=models.CharField(
                help_text="Enter phone number with or without country code.",
                max_length=15,
                unique=True,
                validators=[
                    django.core.validators.RegexValidator(
                        message="Phone number must be 10-15 digits, optionally prefixed with '+'.",
                        regex="^\\+?\\d{10,15}$",
                    )
                ],
            ),
        ),
    ]