from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'is_active', 'date_joined')
    search_fields = ('username', 'name', 'email')
    list_filter = ('is_active', 'is_staff', 'date_joined')
