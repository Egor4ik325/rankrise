from django.contrib.auth import models
from django.utils.translation import gettext_lazy as _
from easy_thumbnails.fields import ThumbnailerImageField


class CustomUser(models.AbstractUser):
    first_name = None
    last_name = None
    avatar = ThumbnailerImageField(
        verbose_name=_("avatar"),
        upload_to="avatars",
        blank=True,
        resize_source={"size": (100, 100), "sharpen": True},
    )
