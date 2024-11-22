from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Update existing phone numbers to include the Nigerian country code if missing'

    def handle(self, *args, **kwargs):
        updated_count = 0

        for number in CustomUser.objects.all():
            if not number.phone_number.startswith('+'):
                # Add +234 if no country code is present
                number.phone_number = f'+234{number.phone_number.lstrip("0")}'
                number.save()
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} phone numbers.')
        )
