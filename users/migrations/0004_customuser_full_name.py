# Generated by Django 5.1.2 on 2024-11-30 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_customuser_role"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="full_name",
            field=models.CharField(blank=True, default="Tg", max_length=150),
        ),
    ]