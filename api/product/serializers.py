from rest_framework import serializers

from .models import Product, ProductImage


class ProductSerializer(serializers.ModelSerializer):
    # images = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ["name", "description", "website", "price", "images"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "product"]
