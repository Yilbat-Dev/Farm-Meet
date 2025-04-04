import json
import logging
import signal
import sys
from django.core.management.base import BaseCommand
from django.db import transaction, IntegrityError, connection
from django.core.exceptions import ValidationError
from customer.models import State, LGA

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Populate States, LGAs, and Capitals from a local JSON file'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set up signal handler for graceful interruption
        signal.signal(signal.SIGINT, self.handle_interrupt)
        signal.signal(signal.SIGTERM, self.handle_interrupt)

    def handle_interrupt(self, signum, frame):
        """Handle keyboard interrupt or termination signal."""
        logger.warning(f"Process interrupted with signal {signum}. Exiting gracefully...")
        sys.exit(1)

    def reset_sequence(self, table_name, column_name='id'):
        """Reset the sequence for the given table and column."""
        with connection.cursor() as cursor:
            cursor.execute(f"ALTER SEQUENCE {table_name}_{column_name}_seq RESTART WITH 1;")
        logger.info(f"Reset sequence for {table_name}.{column_name}")

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to JSON file', default='customer/location.json')

    def validate_json_data(self, data):
        """Validate JSON data structure."""
        if not isinstance(data, dict):
            raise ValidationError("JSON must be a dictionary of states")
        
        for state, details in data.items():
            if not isinstance(details, dict):
                raise ValidationError(f"Invalid details for state {state}")
            if 'lgas' not in details or not isinstance(details['lgas'], list):
                raise ValidationError(f"Missing or invalid LGAs for state {state}")

    def handle(self, *args, **options):
        json_file_path = options['file']
        
        try:
            with open(json_file_path, 'r') as file:
                data = json.load(file)
            
            self.validate_json_data(data)
            
            with transaction.atomic():
                # Reset sequences for State and LGA tables (PostgreSQL example)
                self.reset_sequence('customer_state')
                self.reset_sequence('customer_lga')

                # Populate States and LGAs
                for state_name, details in data.items():
                    capital = details.get('capital', 'Unknown')
                    lgas = list(set(details.get('lgas', [])))  # Remove duplicates

                    state, created = State.objects.get_or_create(
                        name=state_name, 
                        defaults={'capital': capital}
                    )
                    if created:
                        logger.info(f"Created state: {state_name}")
                    else:
                        logger.info(f"State already exists: {state_name}")

                    # Fetch existing LGAs for the state to avoid duplicates
                    existing_lgas = set(LGA.objects.filter(state=state).values_list('name', flat=True))
                    new_lgas = [lga_name for lga_name in lgas if lga_name not in existing_lgas]

                    # Bulk create new LGAs
                    if new_lgas:
                        LGA.objects.bulk_create([
                            LGA(state=state, name=lga_name) 
                            for lga_name in new_lgas
                        ])
                        logger.info(f"Added {len(new_lgas)} LGAs to {state_name}")
                    else:
                        logger.info(f"No new LGAs to add for {state_name}")

                self.stdout.write(self.style.SUCCESS('States, LGAs populated successfully!'))

        except FileNotFoundError:
            logger.error(f"JSON file not found: {json_file_path}")
            self.stdout.write(self.style.ERROR(f"File not found: {json_file_path}"))
        
        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Data validation error: {e}")
            self.stdout.write(self.style.ERROR(f"Data error: {e}"))
        
        except IntegrityError as e:
            logger.error(f"Database integrity error: {e}")
            self.stdout.write(self.style.ERROR(f"Database error: {e}"))
        
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            self.stdout.write(self.style.ERROR(f"Unexpected error: {e}"))