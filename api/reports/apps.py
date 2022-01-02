from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ReportsConfig(AppConfig):
    """
    Application config for reports app.
    """

    name = "reports"
    verbose_name = _("Reports")
    label = "reports"
