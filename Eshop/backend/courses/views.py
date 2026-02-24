from collections import Counter
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        return [AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return Order.objects.filter(user=user).order_by("-created_at")
        return Order.objects.none()

    def create(self, request, *args, **kwargs):
        raw_items = request.data.get("items", [])
        qty_map = Counter(int(i) for i in raw_items)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            for product_id, qty in qty_map.items():
                try:
                    product = Product.objects.select_for_update().get(pk=product_id)
                    if product.stock < qty:
                        return Response(
                            {"error": f"{product.name} only has {product.stock} left in stock."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    product.stock -= qty
                    product.save()
                except Product.DoesNotExist:
                    return Response(
                        {"error": f"Product {product_id} not found."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            user = request.user if request.user.is_authenticated else None
            order = serializer.save(user=user)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
