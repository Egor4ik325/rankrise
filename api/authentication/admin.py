from django.contrib import admin
from django.contrib.auth import get_user_model
from easy_thumbnails.fields import ThumbnailerImageField
from easy_thumbnails.widgets import ImageClearableFileInput

UserModel = get_user_model()


class UserAdmin(admin.ModelAdmin):
    formfield_overrides = {ThumbnailerImageField: {"widget": ImageClearableFileInput}}


admin.site.register(UserModel, UserAdmin)
