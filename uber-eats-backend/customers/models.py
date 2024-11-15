from django.contrib.auth.models import AbstractUser
from django.db import models
from django import forms
# from accounts.models import User


def upload_path(instance, filename):
    # Extract the file extension
    extension = filename.split('.')[-1]
    
    # Format the new filename with the user's name and original extension
    new_filename = f"{instance.username}'_'('profile_picture').{extension}"
    
    #  Define the full path to save the file
    return '/'.join(['profile_pictures', str(instance.username), new_filename])

class Customer(AbstractUser):
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile', null = True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    nickname = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(null=True, blank=True, upload_to=upload_path)
    favorites = models.TextField(null=True, blank=True)  # Assuming favorites is a text field
    # user_type = models.CharField(default='restaurant', max_length=10)


    REQUIRED_FIELDS = ['name', 'email']
    USERNAME_FIELD = 'username'

    def __str__(self):
        return f"{self.username} - {self.email}"
    
    def get_profile_picture_url(self):
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
        return '/static/images/default_profile_picture.png'  # Path to a default placeholder image
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customer_user_set',
        blank=True,
        help_text='The groups this customer belongs to.',
        verbose_name='groups'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customer_user_permissions',
        blank=True,
        help_text='Specific permissions for this customer.',
        verbose_name='user permissions'
    )

# def upload_path(instance, filename):
#     return '/'.join(['profile_pictures', str(instance.username), filename])
