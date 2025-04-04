from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        """
        Custom logic to save additional fields (e.g., phone_number) when linking a social account.
        """
        # Call the default behavior first
        user = super().save_user(request, sociallogin, form)
        
        # Add custom logic: Extract and save phone_number (if provided)
        if sociallogin.account.provider in ['google', 'facebook']:  # Check if it's Google or Facebook
            phone_number = request.data.get('phone_number', '')  # Extract phone_number from request
            if phone_number:
                user.phone_number = phone_number
                user.save()  # Save the updated user instance
        
        return user
