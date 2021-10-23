from django.contrib import admin

from option.models import Option


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    pass
