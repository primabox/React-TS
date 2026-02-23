from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200) #textové pole pro název 
    price = models.DecimalField(max_digits=10, decimal_places=2) # Číslo pro cenu
    description = models.TextField() # Dlouhý text pro popis
    category = models.CharField(max_length=100) # Text pro kategorii
    
    def __str__(self):
        return self.name # Aby se nám v adminu zobrazoval název kurzu
    