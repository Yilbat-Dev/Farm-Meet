from django.contrib import admin
from .models import FarmProduce, FarmerProfile, BankAccount, WithdrawalRequest

admin.site.register(FarmProduce)
admin.site.register(FarmerProfile)
admin.site.register(BankAccount)
admin.site.register(WithdrawalRequest)
