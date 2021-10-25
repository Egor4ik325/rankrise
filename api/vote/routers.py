from rest_framework_nested import routers

from option.urls import questions_router
from vote.views import VoteViewSet


options_router = routers.NestedDefaultRouter(
    questions_router, r"options", lookup="option"
)
options_router.register(r"votes", VoteViewSet, basename="vote")
urlpatterns = options_router.urls
