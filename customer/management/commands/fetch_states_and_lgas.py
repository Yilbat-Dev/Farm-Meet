import json
from django.core.management.base import BaseCommand
from customer.models import State, LGA

class Command(BaseCommand):
    help = 'Populate States, LGAs, and Capitals from a local JSON file'

    def handle(self, *args, **kwargs):
        # Path to your JSON file
        json_file_path = 'customer/location.json'
          
        State.objects.all().delete()
        LGA.objects.all().delete()

        with open(json_file_path, 'r') as file:
            data = json.load(file)
        
       

        for state_name, details in data.items():
            capital = details.get('capital', 'Unknown')  # Provide a default if missing
            lgas = details.get('lgas', [])  # Ensure lgas is a list

            if not capital:
                self.stdout.write(self.style.WARNING(f"Missing 'capital' for state: {state_name}"))

            state, created = State.objects.get_or_create(name=state_name, capital=capital)

            for lga_name in lgas:
                if lga_name:
                    LGA.objects.get_or_create(state=state, name=lga_name)

        self.stdout.write(self.style.SUCCESS('States, LGAs, and Capitals populated successfully!'))
