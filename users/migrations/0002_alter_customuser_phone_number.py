# Generated by Django 5.1.2 on 2024-11-20 05:47

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="phone_number",
            field=models.CharField(
                help_text="Enter phone number with or without country code. Defaults to +234 if none provided.",
                max_length=15,
                validators=[
                    django.core.validators.RegexValidator(
                        message="Phone number must be 10-15 digits, optionally prefixed with '+'.",
                        regex="^\\+?\\d{10,15}$",
                    )
                ],
            ),
        ),
    ]