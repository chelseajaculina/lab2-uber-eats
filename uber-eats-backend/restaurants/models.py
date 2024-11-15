from django.db import models
from django.contrib.auth.models import AbstractUser
# from accounts.models import User

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class RestaurantManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

# Extend Django's built-in AbstractUser model for restaurant-specific fields
class Restaurant(AbstractUser):
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='restaurant_profile', null = True)
    restaurant_name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    contact_info = models.CharField(max_length=100, null=True, blank=True)
    images = models.ImageField(upload_to='restaurant_images/', null=True, blank=True)
    timings = models.CharField(max_length=100, null=True, blank=True)
    # Set user_type to 'restaurant' to distinguish between user types (if needed)
    user_type = models.CharField(default='restaurant', max_length=10)

    def __str__(self):
        return self.restaurant_name
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='restaurant_user_set',
        blank=True,
        help_text='The groups this restaurant belongs to.',
        verbose_name='groups'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='restaurant_user_permissions',
        blank=True,
        help_text='Specific permissions for this restaurant.',
        verbose_name='user permissions'
    )

# Dish Model to store information about the restaurant's dishes
class Dish(models.Model):
    CATEGORY_CHOICES = [
        ('Appetizer', 'Appetizer'),
        ('Salad', 'Salad'),
        ('Main Course', 'Main Course'),
        ('Dessert', 'Dessert'),
        ('Beverage', 'Beverage'),
    ]
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='dishes')
    name = models.CharField(max_length=100)
    ingredients = models.TextField()
    image = models.ImageField(upload_to='dish_images/', null=True, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.restaurant.restaurant_name})"

    class Meta:
        ordering = ['name']

# Order model (optional - assuming there will be order management)
class Order(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    DELIVERY_STATUS_CHOICES = [
        ('Order Received', 'Order Received'),
        ('Preparing', 'Preparing'),
        ('On the Way', 'On the Way'),
        ('Pick up Ready', 'Pick up Ready'),
        ('Delivered', 'Delivered'),
        ('Picked Up', 'Picked Up'),
    ]

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    customer = models.CharField(max_length=100)  # Link to customer model if exists
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='Order Received')
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer} at {self.restaurant.restaurant_name}"



def upload_path(instance, filename):
    # Extract the file extension
    extension = filename.split('.')[-1]
    
    # Format the new filename with the user's name and original extension
    new_filename = f"{instance.username}'_'('profile_picture').{extension}"
    
    #  Define the full path to save the file
    return '/'.join(['profile_pictures', str(instance.username), new_filename])


def upload_path(instance, filename):
    return '/'.join(['profile_pictures', str(instance.username), filename])
