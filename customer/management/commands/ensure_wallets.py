from django.core.management.base import BaseCommand
from farmer.models import FarmerProfile
from wallet.models import Wallet

class Command(BaseCommand):
    help = "Ensure all FarmerProfiles have a Wallet"

    def handle(self, *args, **kwargs):
        farmer_profiles = FarmerProfile.objects.all()
        for farmer in farmer_profiles:
            if not hasattr(farmer, "farmer_wallet"):  # Check if a wallet exists
                Wallet.objects.create(farmer=farmer)
                self.stdout.write(f"Created wallet for Farmer: {farmer.full_name}")
        self.stdout.write("Wallet creation process completed.")
