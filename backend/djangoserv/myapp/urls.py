from django.urls import path
from . import views



urlpatterns = [
    path("", views.home, name="home"),
    path('initiate_oauth/', views.initiate_oauth, name='initiate_oauth'),
    path('oauth_callback/', views.oauth_callback, name='oauth_callback'),
    path('error/', views.error, name='error'),
    # Add other paths as needed
]