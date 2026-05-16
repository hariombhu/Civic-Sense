from django.urls import path
from .views import StatsView, NotificationView, HealthCheckView

urlpatterns = [
    path('stats/', StatsView.as_view()),
    path('notifications/', NotificationView.as_view()),
    path('health/', HealthCheckView.as_view()),
]