from django.contrib import admin
from easy_thumbnails.fields import ThumbnailerImageField
from easy_thumbnails.widgets import ImageClearableFileInput

from .models import CustomUser

class UserAdmin(admin.ModelAdmin):
    formfield_overrides = {
        ThumbnailerImageField: {'widget': ImageClearableFileInput}
    }

admin.site.register(CustomUser, UserAdmin)