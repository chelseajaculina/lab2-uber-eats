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

class CustomerSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = ['username', 'name', 'email', 'date_of_birth', 'city', 'state', 'country', 'nickname', 'phone', 'profile_picture', 'favorites', 'password']


    
# customers/serializers.py
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = attrs.get('refresh')
        if not refresh:
            raise serializers.ValidationError('Refresh token is required.')
        return attrs


