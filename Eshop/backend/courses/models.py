from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=100)
    stock = models.IntegerField(default=10)  # Default stock
    
    def __str__(self):
        return self.name  # Display name in admin
    
    
class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    customer_email = models.EmailField()
    
    # A product can appear in multiple orders
    items = models.ManyToManyField(Product)
    
    def __str__(self):
        return f"Order {self.id} - {self.customer_email}"    
    