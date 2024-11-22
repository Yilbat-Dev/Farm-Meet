
import africastalking
from django.conf import settings

class AfricaTalkingService:
    def __init__(self):
        self.username = settings.AFRICASTALKING_USERNAME
        self.api_key = settings.AFRICASTALKING_API_KEY
        africastalking.initialize(self.username, self.api_key)
        self.sms = africastalking.SMS

    def send_sms(self, phone_number, message):
        """
        Sends an SMS using Africa's Talking.
        """
        try:
            response = self.sms.send(message, [phone_number])
            return {"status": "success", "response": response}
        except Exception as e:
            return {"status": "error", "message": str(e)}
