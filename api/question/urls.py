from rest_framework import routers

from .views import QuestionViewSet

router = routers.SimpleRouter()
router.register("questions", QuestionViewSet)
urlpatterns = router.urls
