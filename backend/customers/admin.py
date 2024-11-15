from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Customer, Restaurant

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'is_active', 'date_joined')
    search_fields = ('username', 'name', 'email')
    list_filter = ('is_active', 'is_staff', 'date_joined')

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "favorites":
            # Ensures that no items are selected by default in admin
            kwargs["queryset"] = Restaurant.objects.none()
        return super().formfield_for_manytomany(db_field, request, **kwargs)