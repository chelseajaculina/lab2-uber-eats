from rest_framework import status, generics, permissions
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import authenticate
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer, RestaurantSignUpSerializer
import logging
from rest_framework import viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer

logger = logging.getLogger(__name__)

# Restaurant Sign-Up View
class RestaurantSignUpView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSignUpSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RestaurantSignUpSerializer(data=request.data, context={'request': request})  # Pass request context
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Restaurant Login View
class RestaurantLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")  # Debugging information

        # Blacklist any existing tokens for the user
        tokens = OutstandingToken.objects.filter(user__username=request.data.get('username'))
        for token in tokens:
            try:
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                logger.error(f"Error blacklisting token: {e}")

        response = super().post(request, *args, **kwargs)
        response.data['message'] = 'You are now logged in successfully.'
        return response

# Restaurant Logout View
class RestaurantLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response(status=status.HTTP_400_BAD_REQUEST)



from rest_framework.parsers import MultiPartParser, FormParser

class RestaurantProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        try:
            restaurant = Restaurant.objects.get(pk=request.user.pk)
            serializer = RestaurantSerializer(restaurant, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                if restaurant.profile_picture:
                    data['profile_picture'] = request.build_absolute_uri(restaurant.profile_picture.url)
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
    

class UploadRestaurantProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Debugging: Check user and headers
        print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
        print(f"Headers: {request.headers}")

        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the file from the request
        file = request.data.get('profile_picture')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

          # Debugging: Check file details
        print(f"File name: {file.name}, File size: {file.size}")

        # Update profile picture for the authenticated user's restaurant profile
        try:
            # Assuming `request.user` has a related `Restaurant` profile
            restaurant = request.user.restaurant
            restaurant.profile_picture = file
            restaurant.save()

            # Build absolute URL for the profile picture
            profile_picture_url = request.build_absolute_uri(restaurant.profile_picture.url)
            return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)

        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant profile not found'}, status=status.HTTP_404_NOT_FOUND)

# Get Restaurant Data View
class GetRestaurantDataView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurant = request.user
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)

# Get Profile Picture View for Restaurant
class GetProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        profile_picture_url = request.restaurant.profile_picture.url if request.restaurant.profile_picture else None

        if not profile_picture_url:
            return Response({'error': 'No profile picture found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)

# Dish Management Views
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Dish, Restaurant
from .serializers import DishSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import MultiPartParser, FormParser

class DishListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # Handle file uploads
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get dishes related to the authenticated restaurant
        if request.user.user_type == 'restaurant':  # Assuming 'user_type' distinguishes restaurant users
            dishes = Dish.objects.filter(restaurant=request.user)
            serializer = DishSerializer(dishes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "You are not authorized to view this resource."}, status=status.HTTP_403_FORBIDDEN)


    def post(self, request):

        # Copy the request data to modify it
        data = request.data.copy()
        data['restaurant'] = request.user.id  # Automatically assign the authenticated restaurant
        
        # Pass the request context to the serializer
        serializer = DishSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(restaurant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Log the errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DishDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, dish_id):
        try:
            dish = Dish.objects.get(id=dish_id, restaurant=request.user)
            serializer = DishSerializer(dish)
            return Response(serializer.data)
        except Dish.DoesNotExist:
            return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)

    
    def put(self, request, dish_id):
        try:
            dish = Dish.objects.get(id=dish_id, restaurant=request.user)
            serializer = DishSerializer(dish, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Dish updated successfully!"}, status=status.HTTP_200_OK)
            else:
                print(serializer.errors)  # Log errors to debug
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Dish.DoesNotExist:
            return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)


    def delete(self, request, dish_id):
        try:
            dish = Dish.objects.get(id=dish_id, restaurant=request.user)
            dish.delete()
            return Response({"message": "Dish deleted successfully!"}, status=status.HTTP_200_OK)
        except Dish.DoesNotExist:
            return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)


# Custom Token Refresh View for Restaurant
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [IsAuthenticated]

# User Profile View (Customer or Restaurant)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = RestaurantSerializer(user)  # Assuming the serializer is adaptable for both Customer and Restaurant
        return Response(serializer.data)


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


import urllib.parse

class RestaurantDetailView(APIView):
    def get(self, request, restaurant_name):
        # Decode any URL-encoded characters in restaurant_name (e.g., %20 -> space)
        restaurant_name = urllib.parse.unquote(restaurant_name)

        # Convert restaurant_name to lowercase to match in the database (if you are storing names in lowercase)
        restaurant_name = restaurant_name.lower()

        # Fetch the restaurant object by name (case-insensitive search)
        restaurant = get_object_or_404(Restaurant, restaurant_name__iexact=restaurant_name)

        # Serialize the restaurant data
        restaurant_serializer = RestaurantSerializer(restaurant)

        # Fetch all dishes related to this restaurant
        dishes = Dish.objects.filter(restaurant=restaurant)
        dish_serializer = DishSerializer(dishes, many=True)

        # Return the serialized restaurant data along with the list of dishes
        return Response({
            'restaurant': restaurant_serializer.data,
            'dishes': dish_serializer.data
        }, status=status.HTTP_200_OK)
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_list_or_404
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer

class RestaurantListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # Fetch all restaurants
        restaurants = Restaurant.objects.all()
        
        # Initialize an empty list to hold each restaurant's data along with its dishes
        data = []

        # Loop through each restaurant, serialize it, and get its associated dishes
        for restaurant in restaurants:
            restaurant_serializer = RestaurantSerializer(restaurant)
            dishes = Dish.objects.filter(restaurant=restaurant)
            dish_serializer = DishSerializer(dishes, many=True)
            
            # Append each restaurant's data with its dishes to the data list
            data.append({
                'restaurant': restaurant_serializer.data,
                'dishes': dish_serializer.data
            })

        # Return the full list of restaurants with their respective dishes
        return Response(data, status=status.HTTP_200_OK)
