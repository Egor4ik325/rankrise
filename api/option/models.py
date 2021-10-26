from django.db import models
from django.utils.translation import gettext_lazy as _
from django.urls import reverse


class Option(models.Model):
    question = models.ForeignKey(
        "question.Question",
        verbose_name=_("question"),
        on_delete=models.CASCADE,
        related_name="options",
    )
    product = models.ForeignKey(
        "product.Product",
        verbose_name=_("product"),
        on_delete=models.SET_NULL,
        related_name="options",
        null=True,
    )

    @property
    def upvotes(self):
        return self.votes.filter(up=True).count()

    @property
    def downvotes(self):
        return self.votes.filter(up=False).count()

    class Meta:
        verbose_name = _("option")
        verbose_name_plural = _("options")
        unique_together = ["question", "product"]

    def __str__(self):
        return f"Option - {self.product}"

    def get_absolute_url(self):
        return reverse(
            "option-detail",
            kwargs={"question_pk": self.question.pk, "pk": self.pk},
        )
