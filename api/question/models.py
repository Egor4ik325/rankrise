from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class Question(models.Model):
    title = models.CharField(_("title"), max_length=100)
    category = models.ForeignKey(
        "category.Category",
        verbose_name=_("category"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="questions",
    )
    ask_time = models.DateTimeField(_("ask time"), auto_now_add=True, editable=False)

    class Meta:
        verbose_name = _("question")
        verbose_name_plural = _("questions")

    def __str__(self) -> str:
        return self.title

    def get_absolute_url(self):
        return reverse("question-detail", kwargs={"pk": self.pk})
