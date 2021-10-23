from rest_framework_nested import routers

from question.urls import router
from option.views import QuestionOptionViewSet


questions_router = routers.NestedSimpleRouter(router, r"questions", lookup="question")
questions_router.register(r"options", QuestionOptionViewSet, basename="option")
urlpatterns = questions_router.urls
