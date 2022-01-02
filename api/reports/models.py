from django.contrib.auth import get_user, get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from model_utils.models import UUIDModel

User = get_user_model()


class Report(UUIDModel):
    """
    Model representing report.
    """

    title = models.CharField(verbose_name=_("title"), max_length=100)
    description = models.TextField(verbose_name=_("description"), blank=True)
    reporter = models.ForeignKey(
        verbose_name=_("Reporter"),
        to=User,
        on_delete=models.SET_NULL,
        related_name="reports",
        null=True,  # can be null on user delete but not in serializer
        default=None,
        unique=False,
        blank=False,
    )

    # Content type of the model (object_model_content_type)
    content_type = models.ForeignKey(
        verbose_name=_("content type"),
        to=ContentType,
        on_delete=models.CASCADE,
        related_name="reports",
    )
    # Primary key of the object of the content type model
    object_pk = models.CharField(_("object ID"), max_length=100)

    # Model str choices: question, product, option, comment.
    object = GenericForeignKey("content_type", "object_pk")

    created = models.DateTimeField(verbose_name=_("Created"), auto_now_add=True)

    class Meta:
        verbose_name = _("Report")
        verbose_name_plural = _("Reports")
        unique_together = []
        ordering = ["created"]

    def clean(self):
        pass

    def __str__(self):
        return f'"{self.title}" related to {self.object} by {self.reporter}'

    def get_absolute_url(self):
        return reverse("reports:detail", kwargs={"pk": self.pk})
