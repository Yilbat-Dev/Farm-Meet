from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Withdrawal
from .serializers import WalletSerializer, WithdrawalSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
import requests
from decimal import Decimal
from farmer.models import BankAccount

class WalletDetailView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure the authenticated user has a FarmerProfile
        farmer_profile = self.request.user.farmer_profile  # Access the FarmerProfile of the authenticated user
        return farmer_profile.farmer_wallet  # Access the Wallet via the OneToOne relationship



class WalletViewSet(viewsets.ModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        """
        Ensure farmers only see their own wallet.
        """
        return Wallet.objects.filter(farmer=self.request.user.farmerprofile)

    @action(detail=False, methods=['post'], url_path='withdraw-funds')
    def withdraw_funds(self, request):
        """
        Withdraw funds from usable balance to the farmer's bank account via Paystack.
        """
        user = request.user
        wallet = Wallet.objects.filter(farmer=user.farmerprofile).first()

        if not wallet:
            return Response({"error": "Wallet not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get withdrawal amount
        amount = request.data.get("amount")
        if not amount:
            return Response({"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = Decimal(amount)
        except:
            return Response({"error": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({"error": "Withdrawal amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        if amount > wallet.usable_balance:
            return Response({"error": "Insufficient balance."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has a linked bank account
        bank_account = BankAccount.objects.filter(farmer=user.farmerprofile).first()
        if not bank_account:
            return Response({"error": "No bank account linked. Please add a bank account first."}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare Paystack request
        paystack_url = "https://api.paystack.co/transfer"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "source": "balance",
            "amount": int(amount * 100),  # Convert to kobo (smallest currency unit)
            "recipient": bank_account.paystack_recipient_code,  # Paystack recipient code for the farmer's bank
            "reason": "Farmer withdrawal",
        }

        # Make Paystack API request
        response = requests.post(paystack_url, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code == 200 and response_data.get("status") == True:
            # Deduct from usable balance
            wallet.usable_balance -= amount
            wallet.save()
            # Record the withdrawal
            Withdrawal.objects.create(
                    farmer=user.farmerprofile,
                    amount=amount,
                    status='success',
                    paystack_reference=response_data.get('data', {}).get('reference', ''),
                    reason='Farmer withdrawal'
                )

            return Response({"message": "Withdrawal successful.", "paystack_data": response_data}, status=status.HTTP_200_OK)
        else:
# Record the failed withdrawal attempt
            Withdrawal.objects.create(
                farmer=user.farmerprofile,
                amount=amount,
                status='failed',
                reason='Withdrawal failed'
            )
            return Response({"error": "Withdrawal failed.", "details": response_data}, status=status.HTTP_400_BAD_REQUEST)



class WithdrawalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    View to list all withdrawals made by the authenticated farmer.
    """
    serializer_class = WithdrawalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Ensure farmers only see their own withdrawals.
        """
        return Withdrawal.objects.filter(farmer=self.request.user.farmerprofile)
