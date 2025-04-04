from rest_framework import serializers
from .models import Wallet, Withdrawal

class WalletSerializer(serializers.ModelSerializer):
    farmer = serializers.ReadOnlyField(source='farmer.id')
    class Meta:
        model = Wallet
        fields = '__all__'


class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = ['id', 'amount', 'date', 'status', 'paystack_reference', 'reason']
