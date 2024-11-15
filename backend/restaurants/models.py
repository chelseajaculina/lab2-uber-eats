from django.db import models
from django.contrib.auth.models import AbstractUser, User

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


def upload_path(instance, filename):
    # This function can dynamically create a directory based on the instance properties
    return f'profile_pictures/{instance.restaurant_name}/{filename}'


def dish_upload_path(instance, filename):
    # Access restaurant's restaurant_name from the related Restaurant instance
    
    return f'profile_pictures/{instance.restaurant.restaurant_name}/{filename}'


# Extend Django's built-in AbstractUser model for restaurant-specific fields
class Restaurant(AbstractUser):
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='restaurant_profile', null = True)
    restaurant_name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    contact_info = models.CharField(max_length=15, null=True, blank=True)
    images = models.ImageField(upload_to=upload_path, null=True, blank=True)
    timings = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.ImageField(upload_to=upload_path, null=True, blank=True)

    # Set user_type to 'restaurant' to distinguish between user types (if needed)
    user_type = models.CharField(default='restaurant', max_length=10)

  # Ensure that the email is unique for each restaurant
    # email = models.EmailField(unique=True)

    REQUIRED_FIELDS = ['email', 'restaurant_name']
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.restaurant_name
    
    def get_profile_picture_url(self):
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
        return '/static/images/default_profile_picture.png'  # Path to a default placeholder image

    
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

    def save(self, *args, **kwargs):
        # Convert restaurant_name to lowercase before saving to the database
        self.restaurant_name = self.restaurant_name.lower()
        super(Restaurant, self).save(*args, **kwargs)

# class RestaurantImage(models.Model):
#     restaurant = models.ForeignKey(Restaurant, related_name='images', on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='restaurant_images/')
#     uploaded_at = models.DateTimeField(auto_now_add=True)

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
    image = models.ImageField(upload_to=dish_upload_path, null=True, blank=True)
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

