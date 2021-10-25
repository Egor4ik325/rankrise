from django.urls import path, include
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

urlpatterns = [
    path(
        "schema/",
        get_schema_view(
            title="Q&A recommendation API",
            description="Get user recommendations for asked questions.",
            version="1.0.0",
        ),
        name="openapi_schema",
    ),
    path(
        "ui/",
        TemplateView.as_view(
            template_name="swagger-ui.html",
            extra_context={"schema_url": "openapi_schema"},
        ),
        name="swagger_ui",
    ),
    path("auth/", include("authentication.urls")),
    path("", include("question.urls")),
    path("", include("product.urls")),
    path("", include("option.urls")),
    path("", include("vote.routers")),
]
