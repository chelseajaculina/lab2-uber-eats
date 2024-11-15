# restaurants/auth_backends.py
from django.contrib.auth.backends import BaseBackend
from .models import Restaurant

class RestaurantAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = Restaurant.objects.get(email=username)
            if user.check_password(password):
                return user
        except Restaurant.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Restaurant.objects.get(pk=user_id)
        except Restaurant.DoesNotExist:
            return None
