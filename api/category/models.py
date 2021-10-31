from django.db import models
from django.urls import reverse
from django.db.models.functions import Upper
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.translation import gettext as _


class Category(MPTTModel):
    name = models.CharField(_("name"), max_length=50, unique=True)
    parent = TreeForeignKey(
        "self",
        on_delete=models.CASCADE,
        verbose_name=_("parent"),
        null=True,
        blank=True,
        related_name="children",
    )

    class Meta:
        verbose_name = _("category")
        verbose_name_plural = _("categories")
        ordering = [Upper("name")]

    class MPTTMeta:
        order_insertion_by = ["name"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("category-detail", kwargs={"pk": self.pk})
