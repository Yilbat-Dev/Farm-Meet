# Generated by Django 5.1.2 on 2024-12-04 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customer", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="state",
            name="capital",
            field=models.CharField(default=12, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="state",
            name="name",
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
