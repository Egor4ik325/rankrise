from rest_framework import serializers
from django.utils.text import slugify

from .models import Product, ProductImage


class ProductSerializer(serializers.ModelSerializer):
    # images = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ["pk", "name", "description", "website", "price", "category", "images"]
        read_only_fields = ["images"]

    def validate_name(self, value):
        if slugify(value) == "images":
            raise serializers.ValidationError('Product name can not be "images".')
        return value


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["pk", "image", "product"]
