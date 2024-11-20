from .models import Restaurant, Dish
from rest_framework import serializers

# Dish Serializer for Adding and Editing Dishes
class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'restaurant', 'name', 'ingredients', 'image', 'price', 'description', 'category']
        read_only_fields = ['restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}, 'image': {'required': False, 'allow_null': True}}


    def create(self, validated_data):
        # Remove 'restaurant' from validated_data since we're passing it separately
        validated_data.pop('restaurant', None)  # Remove the restaurant field from validated_data if it exists
        restaurant = self.context['request'].user
        return Dish.objects.create(restaurant=restaurant, **validated_data)
    

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image is not None:
            instance.image = image
        instance.save()
        return instance


# Restaurant Serializer for Sign-Up and Profile Management
class RestaurantSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True, use_url=False)  # Allow direct file upload

    class Meta:
        model = Restaurant
        fields = ['id', 
                  'username', 
                  'email', 
                  'password', 
                  'restaurant_name', 
                  'location', 
                  'description', 
                  'contact_info', 
                  'images', 
                  'timings',
                  'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        restaurant = Restaurant.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            restaurant_name=validated_data.get('restaurant_name'),
            location=validated_data.get('location'),
            description=validated_data.get('description'),
            contact_info=validated_data.get('contact_info'),
            images=validated_data.get('images'),
            timings=validated_data.get('timings'),
            profile_picture=validated_data.get('profile_picture')
        )
        return restaurant

    def get_profile_picture(self, obj):
        # Return URL for the profile picture or a default if not available
        if obj.profile_picture:
            return obj.profile_picture.url
        return '/static/images/default_profile_picture.png'  # Default image path


    def update(self, instance, validated_data):
        instance.restaurant_name = validated_data.get('restaurant_name', instance.restaurant_name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.contact_info = validated_data.get('contact_info', instance.contact_info)
        instance.images = validated_data.get('images', instance.images)
        instance.timings = validated_data.get('timings', instance.timings)
        instance.save()
        return instance
    
    # def validate_email(self, value):
    #     if Restaurant.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("This email is already registered. Please use a different email.")
    #     return value

    # def validate_username(self, value):
    #     if Restaurant.objects.filter(username=value).exists():
    #         raise serializers.ValidationError("This username is already taken. Please choose another one.")
    #     return value

    def validate_profile_picture(self, value):
        # Check that the file is an image, if needed
        if not value.content_type.startswith('image'):
            raise serializers.ValidationError("Uploaded file is not an image.")
        return value

class RestaurantSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['username', 'email', 'password', 'restaurant_name', 'location']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Use `self.context.get('request')` to safely access the request if present
        user = self.context.get('request').user if self.context.get('request') else None

        restaurant = Restaurant.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            restaurant_name=validated_data.get('restaurant_name'),
            location=validated_data.get('location'),
            description=validated_data.get('description'),
            contact_info=validated_data.get('contact_info'),
            timings=validated_data.get('timings'),
            profile_picture=validated_data.get('profile_picture'),
        )
        return restaurant

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class RestaurantTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        print(f"Username: {username}, Password: {password}")  # Debugging information

        user = authenticate(username=username, password=password)

        if user is None:
            print("Authentication failed")  # Debugging information
            raise serializers.ValidationError('Invalid credentials')

        # Check if the user is a restaurant
        if not hasattr(user, 'restaurant'):
            print("User is not a restaurant")  # Debugging information
            raise serializers.ValidationError('This user is not a restaurant')

        print("Authentication successful")  # Debugging information
        return super().validate(attrs)
    
