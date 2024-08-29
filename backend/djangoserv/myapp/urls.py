from django.urls import path
from . import views

urlpatterns = [
    path('auth/', views.home, name='home'),
    path('auth/healthy', views.healthy, name='healthy'),
    path('auth/profile', views.profile, name='profile'),
    path('auth/logout', views.logout, name='logout'),
    path('auth/initiate_oauth/', views.initiate_oauth, name='initiate_oauth'),
    path('auth/oauth_callback/', views.oauth_callback, name='oauth_callback'),
    path('auth/error/', views.error, name='error'),
    path('auth/post_oauth/', views.post_oauth, name='post_oauth'),
]
