from rest_framework import serializers
from .models import Product, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    # We want to send product IDs from React
    class Meta:
        model = Order
        fields = ['id', 'customer_email', 'total_price', 'items', 'created_at']