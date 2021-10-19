from rest_framework import routers

from .views import ProductViewSet, ProductImageViewSet

router = routers.SimpleRouter()
router.register("products", ProductViewSet)
router.register("products/images", ProductViewSet)
urlpatterns = router.urls
