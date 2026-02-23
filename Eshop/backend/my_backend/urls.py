from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import ProductViewSet

# Router nám automaticky vygeneruje čisté URL adresy
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # Tady se vytvoří adresa /api/products/
]