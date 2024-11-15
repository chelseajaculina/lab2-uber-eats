from django.contrib import admin
from .models import Restaurant

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('username', 'restaurant_name', 'email', 'location', 'is_active', 'date_joined')
    search_fields = ('username', 'restaurant_name', 'email', 'location')
    list_filter = ('is_active', 'is_staff', 'date_joined')


