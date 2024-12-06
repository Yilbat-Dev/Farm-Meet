import requests
from django.core.management.base import BaseCommand
from customer.models import State, LGA

class Command(BaseCommand):
    help = 'Fetch and populate States, LGAs, and Capitals from LocationIQ API'

    def handle(self, *args, **kwargs):
        # LocationIQ API endpoint and your API key
        url = "https://us1.locationiq.com/v1/search.php"
        api_key = "pk.0f24880843e6579203c689bc9c71f856"  # Replace with your actual API key

        # Parameters for the API request to search for Nigerian states
        params = {
            'key': api_key,
            'q': 'Nigeria',  # Search for Nigeria to get states and LGAs
            'format': 'json',
            'addressdetails': 1  # Fetch detailed address information
        }

        # Make the request to the API
        response = requests.get(url, params=params)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()

            # Ensure data is available in the response
            if not data:
                self.stdout.write(self.style.ERROR('No data found in the API response'))
                return

            # Loop through the states and process the data
            for state_data in data:
                state_name = state_data.get('address', {}).get('state', '')
                capital = state_data.get('address', {}).get('county', '')  # Some LGAs may have county as capital

                if state_name:
                    # Create or get the state and store the capital (if available)
                    state, created = State.objects.get_or_create(
                        name=state_name,
                        capital=capital
                    )

                    # Get LGAs associated with the state
                    lgas = state_data.get('address', {}).get('locality', [])
                    for lga_name in lgas:
                        # Create or get the LGA and associate it with the state
                        LGA.objects.get_or_create(state=state, name=lga_name)

            # Success message after population
            self.stdout.write(self.style.SUCCESS('States, LGAs, and Capitals populated successfully!'))
        
        else:
            # Error message if the API request fails
            self.stdout.write(self.style.ERROR(f'Failed to fetch data from the API. Status Code: {response.status_code}'))







