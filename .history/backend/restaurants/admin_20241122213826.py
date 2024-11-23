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
from django.contrib import admin
from .models import Order, OrderDish

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'restaurant', 'customer', 'status', 'delivery_status', 'order_date', 'get_dishes')
    search_fields = ('customer__username', 'restaurant__restaurant_name', 'status', 'delivery_status')
    list_filter = ('status', 'delivery_status', 'order_date', 'restaurant')
    ordering = ['-order_date']

    def get_dishes(self, obj):
        # Return a comma-separated list of dish names for this order
        return ", ".join([f"{item.dish.name} x{item.quantity}" for item in obj.order_items.all()])
    get_dishes.short_description = 'Dishes'

# Register OrderDish separately if needed
@admin.register(OrderDish)
class OrderDishAdmin(admin.ModelAdmin):
    list_display = ('order', 'dish', 'quantity')
    search_fields = ('order__id', 'dish__name')
    list_filter = ('order', 'dish')
