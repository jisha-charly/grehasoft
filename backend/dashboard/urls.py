from django.urls import path
from .views import dashboard_analytics

urlpatterns = [
    path("analytics/", dashboard_analytics),
]
