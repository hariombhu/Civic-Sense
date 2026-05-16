from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet
from .organization_views import OrganizationViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'organizations', OrganizationViewSet, basename='organizations')

urlpatterns = [
    path('', include(router.urls)),
]
