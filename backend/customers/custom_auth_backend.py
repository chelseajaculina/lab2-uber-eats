from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from customers.models import Customer
from restaurants.models import Restaurant

class CustomUserBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, user_type=None, **kwargs):
        try:
            if user_type == 'customer':
                user = Customer.objects.get(username=username)
            elif user_type == 'restaurant':
                user = Restaurant.objects.get(username=username)
            else:
                return None

            if user and check_password(password, user.password):
                return user
        except (Customer.DoesNotExist, Restaurant.DoesNotExist):
            return None
        return None

    def get_user(self, user_id):
        try:
            return Customer.objects.get(pk=user_id)
        except Customer.DoesNotExist:
            try:
                return Restaurant.objects.get(pk=user_id)
            except Restaurant.DoesNotExist:
                return None
