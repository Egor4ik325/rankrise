from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class Vote(models.Model):
    option = models.ForeignKey(
        "option.Option",
        verbose_name=_("option"),
        on_delete=models.CASCADE,
        related_name="votes",
    )
    user = models.ForeignKey(
        "authentication.UserModel",
        verbose_name=_("user"),
        on_delete=models.SET_NULL,
        related_name="votes",
        null=True,
    )
    up = models.BooleanField(_("upvote"))
    vote_time = models.DateTimeField(_("vote time"), auto_now_add=True)

    class Meta:
        verbose_name = _("vote")
        verbose_name_plural = _("votes")
        unique_together = ["option", "user"]
        ordering = ["-vote_time"]
        get_latest_by = "-vote_time"

    def __str__(self):
        return f"Vote for {self.option}"

    def get_absolute_url(self):
        return reverse(
            "vote-detail",
            kwargs={
                "question_pk": self.option.question.pk,
                "option_pk": self.option.pk,
                "pk": self.pk,
            },
        )
