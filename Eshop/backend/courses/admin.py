from django.contrib import admin
from .models import Product, Order

# Define how products look in the admin list
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "stock")
    search_fields = ("name", "category")

# Define how orders look in the admin list
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_email", "total_price", "created_at")
    list_filter = ("created_at",) # Filter by date on the right side
    search_fields = ("customer_email",)

# Register models to make them visible in the dashboard
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)