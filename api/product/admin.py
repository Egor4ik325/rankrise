from django.contrib import admin

from .models import Product, ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    readonly_fields = ["name"]


admin.site.register(ProductImage)
