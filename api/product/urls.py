from django.urls import path, include
from rest_framework import routers

from .views import ProductViewSet, ProductImageViewSet

router = routers.SimpleRouter()
router.register("products/images", ProductImageViewSet)
router.register("products", ProductViewSet)
urlpatterns = router.urls
