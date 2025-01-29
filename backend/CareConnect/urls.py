from django.contrib import admin
from django.urls import path, include
from appointment import urls as appointment_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include(appointment_urls)),
]
