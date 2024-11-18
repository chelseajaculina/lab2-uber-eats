from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from .serializers import CustomerSignUpSerializer, CustomerSerializer
from .models import Customer
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import permissions, status


# api view for signup 
class CustomerSignUpView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSignUpSerializer
    permission_classes = [AllowAny]

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import JSONParser

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [IsAuthenticated]

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

User = get_user_model()

class CustomerLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Extract username and password
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user exists and is active
        try:
            user = User.objects.get(username=username)
            if not user.is_active:
                return Response({'error': 'User account is inactive.'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'No active account found with the given credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Blacklist existing tokens for the user (if necessary)
        try:
            tokens = OutstandingToken.objects.filter(user=user)
            for token in tokens:
                try:
                    _, _ = BlacklistedToken.objects.get_or_create(token=token)
                except Exception as e:
                    print(f"Error blacklisting token: {e}")
        except Exception as e:
            print(f"Error during token blacklisting: {e}")

        # Proceed with login and obtain JWT tokens
        response = super().post(request, *args, **kwargs)
        response.data['message'] = 'You are now logged in successfully.'
        return response


from rest_framework import generics, permissions
from .models import Customer
from .serializers import CustomerSerializer


from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

# update customer data
class CustomerProfileView(APIView):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Ensure the view can handle multipart form data

    def get(self, request):
        if isinstance(request.user, Customer):
            serializer = CustomerSerializer(request.user)
            return Response(serializer.data)
        return Response({'error': 'No customer data available'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        try:
            # Check that the request user is authenticated
            if not request.user.is_authenticated:
                return Response({'error': 'User is not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

            print(f"Request data: {request.data}")  # Debugging: See what data is received by the server

            # Fetch the customer instance
            customer = Customer.objects.get(pk=request.user.pk)

            # Serialize and validate data
            serializer = CustomerSerializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print(f"Serializer errors: {serializer.errors}")  # Debugging
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {str(e)}")  # Debugging
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

from django.http import JsonResponse
from rest_framework.decorators import permission_classes



from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

class UploadProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Debugging: Check user and headers
        print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
        print(f"Headers: {request.headers}")

        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        file = request.data.get('profile_picture')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Update profile picture for the authenticated user
        request.user.profile_picture = file
        request.user.save()

        # Return the profile picture URL (make sure your User model has profile_picture defined correctly)
        profile_picture_url = request.user.profile_picture.url

        return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)


class GetCustomerDataView(generics.RetrieveAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customer = request.user  # Assumes the user is authenticated
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)


class GetProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        profile_picture_url = request.user.profile_picture.url if request.user.profile_picture else None

        if not profile_picture_url:
            return Response({'error': 'No profile picture found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomerSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = request.user  # Assumes the user is authenticated
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .models import Customer
from .serializers import CustomerSerializer

class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = CustomerSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

