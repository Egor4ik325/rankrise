from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin

from .models import Product, ProductImage


class ProductResource(resources.ModelResource):
    class Meta:
        model = Product


@admin.register(Product)
class ProductAdmin(ImportExportActionModelAdmin):
    resource_class = ProductResource
    # readonly_fields = ["name"]


admin.site.register(ProductImage)
