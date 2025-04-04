from django.shortcuts import render

# Create your views here.
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.authentication import TokenAuthentication
from .models import FarmProduce, FarmerProfile, ProduceImage, BankAccount, WithdrawalRequest
from .serializers import FarmerProfileSerializer, ProduceSerializer, BankAccountSerializer, WithdrawalRequest
from wallet.models import Wallet
from .permissions import IsFarmerOrReadOnly, IsFarmerOwner
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import action
import requests
import uuid
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from wallet.models import Wallet
from wallet.serializers import WalletSerializer
import logging
from django.shortcuts import get_object_or_404 
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Count

logger = logging.getLogger(__name__)


class FarmerProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Farmer Profiles:
    - List and retrieve are available for all authenticated users.
    - Update and delete are restricted to profile owners.
    """
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmerOrReadOnly]
    parser_classes = [MultiPartParser, JSONParser]

    @action(detail=False, methods=['get'], url_path='check-profile')
    def check_farmer_profile(self, request):
        """Check if the user has a farmer profile and return it if available."""
        user = request.user
        if not user.is_authenticated:
            return Response({"message": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        farmer_profile = getattr(user, 'farmer_profile', None)
        if farmer_profile:
            return Response({"message": "Farmer profile exists.", "profile_id": farmer_profile.id}, status=status.HTTP_200_OK)
        
        return Response({"message": "No Farmer Profile. Please create one."}, status=status.HTTP_404_NOT_FOUND)
    @action(detail=False, methods=['get'], url_path='my-profile')
    def get_my_profile(self, request):
        """Return the authenticated user's farmer profile if it exists."""
        user = request.user
        if not user.is_authenticated:
            return Response({"message": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        
        farmer_profile = getattr(user, 'farmer_profile', None)
        if farmer_profile:
            serializer = self.get_serializer(farmer_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response({"message": "Farmer profile does not exist. Please create one."}, status=status.HTTP_404_NOT_FOUND)




class ProduceViewSet(viewsets.ModelViewSet):
    queryset = FarmProduce.objects.all()
    serializer_class = ProduceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]

    def get_queryset(self):
        """
        Authenticated users can view all produce.
        """
        return FarmProduce.objects.all()

    def perform_create(self, serializer):
        """
        Only users with the 'farmer' role can create produce.
        """
        user = self.request.user

        if user.role != 'farmer':
            raise PermissionDenied("Only farmers can create produce.")
        # Ensure the farmer has a profile
        farmer_profile, created = FarmerProfile.objects.get_or_create(
            user=user)
        serializer.save(farmer_profile=farmer_profile)

    def create(self, request, *args, **kwargs):
        """
        Handle creation of Produce with associated images.
        """
        data = request.data
        images = request.FILES.getlist('images')  # Get multiple images
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            # Save the Produce object with `perform_create`
            self.perform_create(serializer)
            produce = serializer.instance

            # Save associated images
            for image in images:
                ProduceImage.objects.create(produce=produce, image=image)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=201, headers=headers)

        return Response(serializer.errors, status=400)

    def perform_update(self, serializer):
        """
        Ensure only the owner of the produce (farmer) can update it.
        """
        user = self.request.user
        if self.get_object().farmer_profile.user != user:
            raise PermissionDenied(
                "You do not have permission to edit this produce.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Ensure only the owner of the produce (farmer) can delete it.
        """
        user = self.request.user
        if instance.farmer_profile.user != user:
            raise PermissionDenied(
                "You do not have permission to delete this produce.")
        instance.delete()

    @action(detail=False, methods=['get'], url_path='my-produce')
    def my_produce(self, request):
        """
        Returns all FarmProduce created by the current farmer user.
        """
        user = request.user
        
        # Check if user has a farmer profile
        if not hasattr(user, 'farmer_profile'):
            return Response(
                {"detail": "User has no farmer profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Filter produce by the current user's farmer profile
        queryset = FarmProduce.objects.filter(farmer_profile=user.farmer_profile)
        serializer = self.get_serializer(queryset, many=True)
        
        return Response(serializer.data)

    def calculate_produce_change(self, farmer, start_date, end_date):
        """Helper function to calculate total number of produce listed and percentage change."""
        current_count = FarmProduce.objects.filter(
            farmer_profile=farmer,
            created_at__gte=start_date
        ).count()

        previous_count = FarmProduce.objects.filter(
            farmer_profile=farmer,
            created_at__lt=start_date,
            created_at__gte=end_date
        ).count()

        if previous_count > 0:
            percentage_change = ((current_count - previous_count) / previous_count) * 100
        else:
            percentage_change = 100 if current_count > 0 else 0

        # Determine change indicator
        if percentage_change > 0:
            change_indicator = "increase"
        elif percentage_change == 0:
            change_indicator = "No change"
        else:
            change_indicator = "decrease"

        return {
            "total_produce_listed": current_count,
            "percentage_change": f"{percentage_change:.2f}%",
            "change_indicator": change_indicator,
        }

    @action(detail=False, methods=['get'], url_path='produce-change-1-day')
    def produce_change_1_day(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        now_time = now()
        past_24_hours = now_time - timedelta(days=1)
        past_48_hours = now_time - timedelta(days=2)

        data = self.calculate_produce_change(farmer, past_24_hours, past_48_hours)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='produce-change-7-days')
    def produce_change_7_days(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        today = now().date()
        past_7_days = today - timedelta(days=7)
        past_14_days = today - timedelta(days=14)

        data = self.calculate_produce_change(farmer, past_7_days, past_14_days)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='produce-change-30-days')
    def produce_change_30_days(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        today = now().date()
        past_30_days = today - timedelta(days=30)
        past_60_days = today - timedelta(days=60)

        data = self.calculate_produce_change(farmer, past_30_days, past_60_days)
        return Response(data)

    @action(detail=False, methods=['get'], url_path='produce-change-6-months')
    def produce_change_6_months(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'farmer_profile'):
            return Response({"message": "User has no Farmer Profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        farmer = user.farmer_profile
        today = now().date()
        past_6_months = today - timedelta(days=180)
        past_12_months = today - timedelta(days=360)

        data = self.calculate_produce_change(farmer, past_6_months, past_12_months)
        return Response(data)

class BankAccountViewSet(viewsets.ModelViewSet):
    """
    Handles adding and updating bank details.
    """
    serializer_class = BankAccountSerializer
    permission_classes = [IsFarmerOwner]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return BankAccount.objects.none()

        try:
            farmer = self.request.user.farmer_profile
        except AttributeError:
            return BankAccount.objects.none()

        return BankAccount.objects.filter(farmer=farmer)

    def perform_create(self, serializer):
        # Automatically set the farmer to the current user
        serializer.save(farmer=self.request.user.farmer_profile)

    # @action(detail=False, methods=['post'], url_path='add-bank')
    # def add_bank_account(self, request):
    #     """
    #     Allows a farmer to add/update bank account details.
    #     """
    #     farmer = request.user.farmer_profile
    #     if bank_account.farmer != farmer:
    #             return Response({"error": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)

    #     serializer = BankAccountSerializer(data=request.data)
        
    #     if serializer.is_valid():
    #         # Create or update bank account
    #         BankAccount.objects.update_or_create(
    #             farmer=farmer,
    #             defaults=serializer.validated_data
    #         )
    #         return Response({"message": "Bank account added successfully"}, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @action(detail=False, methods=["get"], url_path="my-bank-accounts")
    # def list_farmer_accounts(self, request):
    #     """Returns a list of the farmer's bank accounts with their IDs."""
    #     farmer = request.user.farmer_profile
    #     if bank_account.farmer != farmer:
    #             return Response({"error": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    #     # farmer = request.user.farmer_profile
    #     bank_accounts = farmer.bank_accounts.all()
    #     serializer = self.get_serializer(bank_accounts, many=True)
    #     return Response(serializer.data)

    # detail=True is key!
    @action(detail=True, methods=['post'], url_path='create-paystack-recipient')
    def create_paystack_recipient(self, request, pk=None):  # pk is important!
        """
        Creates a Paystack transfer recipient and stores the recipient code.
        """

        try:
            farmer = request.user.farmer_profile  # Ensure farmer profile is retrieved
            bank_account = self.get_object()  # Now gets the correct instance!

            if bank_account.farmer != farmer:
                return Response({"error": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        except NotFound:
            return Response({"error": "Bank account not found."}, status=status.HTTP_404_NOT_FOUND)

        # if bank_account.paystack_recipient_code:  # check if it exists
        #     return Response({"message": "Paystack recipient code already exists."}, status=status.HTTP_200_OK)

        # Validate required fields (more robust validation)
        required_fields = ['account_name', 'account_number', 'bank_code']
        for field in required_fields:
            if not getattr(bank_account, field, None):
                # Use ValidationError
                raise ValidationError({field: f"This field is required."})

        url = "https://api.paystack.co/transferrecipient"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        data = {
            "type": "nuban",
            "name": bank_account.account_name,
            "account_number": bank_account.account_number,
            "bank_code": bank_account.bank_code,
            "currency": "NGN"
        }

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()  # Raise HTTPError for bad responses
            response_data = response.json()

            if response_data.get("status") is True:
                bank_account.paystack_recipient_code = response_data["data"]["recipient_code"]
                bank_account.save()
                # return the code
                return Response({"message": "Paystack recipient code created successfully.", "recipient_code": bank_account.paystack_recipient_code}, status=status.HTTP_200_OK)

            else:
                error_message = response_data.get(
                    'message', 'Paystack API request failed')
                return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

        except requests.exceptions.RequestException as e:
            logger.error(f"Paystack API request failed: {e}")
            return Response({"error": f"Paystack API request failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except (KeyError, TypeError) as e:  # handle keyerror and typeerror exceptions
            logger.error(f"Unexpected response format from Paystack API: {e}")
            return Response({"error": f"Unexpected response from Paystack API: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WalletViewSet(viewsets.ViewSet):
    """
    Viewset for handling farmer wallet actions, including withdrawals.
    """
    serializer_class = WalletSerializer

    @action(detail=False, methods=['post'], url_path='withdraw')
    def withdraw_funds(self, request):
        """
        Allows a farmer to withdraw funds from usable balance to their bank account.
        """
        farmer = request.user.farmer_profile
        bank_account_id = request.data.get("bank_account_id")
        amount = request.data.get("amount")

        # Validate amount
        try:
            amount = Decimal(str(amount))  # Convert amount to Decimal
            if amount <= Decimal('0'):
                return Response({"error": "Invalid withdrawal amount."}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, InvalidOperation):
            return Response({"error": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch bank account
        bank_account = get_object_or_404(
            BankAccount, id=bank_account_id, farmer=farmer
        )

        # Fetch wallet
        wallet = farmer.farmer_wallet

        # Ensure sufficient usable balance
        if amount > wallet.usable_balance:
            return Response({"error": "Insufficient funds."}, status=status.HTTP_400_BAD_REQUEST)

        # # Ensure Paystack recipient code exists
        # if not bank_account.paystack_recipient_code:
        #     return Response({"error": "Bank account not verified with Paystack."}, status=status.HTTP_400_BAD_REQUEST)

        # Create withdrawal request and deduct funds
        withdrawal = None
        try:
            with transaction.atomic():
                withdrawal = WithdrawalRequest.objects.create(
                    farmer=farmer, amount=amount
                )

                # Deduct funds from usable balance
                wallet.usable_balance -= amount
                

                # # Initiate Paystack transfer
                # PAYSTACK_TRANSFER_URL = "https://api.paystack.co/transfer"
                # headers = {
                #     "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                #     "Content-Type": "application/json"
                # }
                # payload = {
                #     "source": "balance",
                #     "amount": int(amount * 100),  # Convert to kobo
                #     "recipient": bank_account.paystack_recipient_code,
                #     "reason": "Farmer withdrawal",
                #     "reference": withdrawal.reference
                # }

                # response = requests.post(PAYSTACK_TRANSFER_URL, headers=headers, json=payload)
                # response_data = response.json()

                # if response.status_code == 200 and response_data.get("status"):
                withdrawal.status = "completed"
                withdrawal.save()
                wallet.save()
                return Response({f"message": "Withdrawal successful amount wihtdrawn:{amount}"}, status=status.HTTP_200_OK)

                # # Handle specific Paystack errors
                # error_code = response_data.get("code")
                # error_message = response_data.get("message")
                
                # if error_code == "transfer_unavailable":
                #     logger.error(f"Business account upgrade required: {response_data}")
                #     # Refund the balance
                #     wallet.usable_balance += amount
                #     wallet.save()
                #     withdrawal.status = "failed"
                #     withdrawal.failure_reason = "Business account upgrade required"
                #     withdrawal.save()
                    
                #     return Response({
                #         "error": "Withdrawal service temporarily unavailable",
                #         "details": "Our payment provider requires a business account upgrade. We are working to resolve this. Please try again later.",
                #     }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

                # # Handle other Paystack failures
                # logger.error(f"Paystack transfer failed: {response_data}")
                # wallet.usable_balance += amount
                # wallet.save()
                # withdrawal.status = "failed"
                # withdrawal.failure_reason = error_message or "Unknown error"
                # withdrawal.save()
                
                # return Response({
                #     "error": "Withdrawal failed. Funds have been refunded to your wallet.",
                #     "details": error_message or "An error occurred while processing your withdrawal."
                # }, status=status.HTTP_400_BAD_REQUEST)

        except requests.RequestException as e:
            logger.error(f"Paystack API request failed: {e}")
            if withdrawal:
                withdrawal.status = "failed"
                withdrawal.failure_reason = str(e)
                withdrawal.save()
                # Refund the balance
                wallet.usable_balance += amount
                wallet.save()
            
            return Response({
                "error": "Unable to process withdrawal at this time. Please try again later.",
                "details": "Connection to payment provider failed."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)