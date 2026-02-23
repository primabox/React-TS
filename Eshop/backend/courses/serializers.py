from rest_framework import serializers
from .models import Product

# Tento soubor funguje jako překladač z databáze do formátu JSON
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__' # To znamená "všechna políčka z databáze"