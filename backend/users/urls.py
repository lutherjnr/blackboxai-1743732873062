from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import (
    UserRegistrationView,
    UserProfileView,
    UserListView,
    RoleUpdateView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/role/', RoleUpdateView.as_view(), name='role-update'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),
]