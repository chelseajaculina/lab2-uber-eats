from rest_framework import serializers, generics, permissions
from .models import Customer
from django.core.files import File
class CustomerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True, use_url=False)  # Allow direct file upload
    date_of_birth = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d'])
    class Meta:
        model = Customer
        fields = ['username', 'name', 'email', 'date_of_birth', 'city', 
                  'state', 'country', 'nickname', 'phone', 'profile_picture', 'favorites']

    def get_profile_picture(self, obj):
        # Return URL for the profile picture or a default if not available
        if obj.profile_picture:
            return obj.profile_picture.url
        return '/static/images/default_profile_picture.png'  # Default image path

    def validate_profile_picture(self, value):
        # Check that the file is an image, if needed
        if not value.content_type.startswith('image'):
            raise serializers.ValidationError("Uploaded file is not an image.")
        return value

from rest_framework import serializers
from .models import Customer

class CustomerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username', 'email', 'password', 'name', 'date_of_birth', 'city', 
                  'state', 'country', 'nickname', 'phone', 'profile_picture', 'favorites']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Create a new customer and hash the password
        customer = Customer.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name'),
            date_of_birth=validated_data.get('date_of_birth'),
            city=validated_data.get('city'),
            state=validated_data.get('state'),
            country=validated_data.get('country'),
            nickname=validated_data.get('nickname'),
            phone=validated_data.get('phone'),
            profile_picture=validated_data.get('profile_picture'),
            favorites=validated_data.get('favorites'),
        )
        return customer

    
# customers/serializers.py
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = attrs.get('refresh')
        if not refresh:
            raise serializers.ValidationError('Refresh token is required.')
        return attrs


