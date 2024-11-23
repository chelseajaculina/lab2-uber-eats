from django.contrib import admin
from .models import Restaurant, Dish, Order

# Registering the Restaurant model
@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('username', 'restaurant_name', 'email', 'location', 'is_active', 'date_joined')
    search_fields = ('username', 'restaurant_name', 'email', 'location')
    list_filter = ('is_active', 'is_staff', 'date_joined')

# Registering the Dish model
@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'category', 'price')
    search_fields = ('name', 'category', 'restaurant__restaurant_name')
    list_filter = ('category',)
    ordering = ['name']

# Registering the Order model
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'restaurant', 'customer', 'dish', 'status', 'delivery_status', 'order_date')
    search_fields = ('customer', 'restaurant__restaurant_name', 'status', 'delivery_status')
    list_filter = ('status', 'delivery_status', 'order_date')
    ordering = ['-order_date']
