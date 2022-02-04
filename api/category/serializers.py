from category.models import Category
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["pk", "name", "parent"]
        read_only_fields = fields
