from rest_framework import routers

from category.viewsets import CategoryViewSet

router = routers.DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")

urlpatterns = router.urls
