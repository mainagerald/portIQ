from django.urls import path
from .views import (
    RegisterAPIView, 
    CustomTokenObtainPairView, 
    VerifyEmailAPIView, 
    GoogleLoginAPIView,
    PasswordResetRequestAPIView, 
    PasswordResetConfirmAPIView,
    UserProfileUpdateAPIView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # User registration endpoint
    path('register/', RegisterAPIView.as_view(), name='register'),
    # JWT obtain/refresh endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Email verification endpoint
    path('verify-email/<uidb64>/<token>/', VerifyEmailAPIView.as_view(), name='verify_email'),
    # Google OAuth2 endpoint (handles both initial flow and callback)
    path('google-login/', GoogleLoginAPIView.as_view(), name='google_login'),
    # Password reset endpoints
    path('reset-password/', PasswordResetRequestAPIView.as_view(), name='password_reset_request'),
    path('reset-password-confirm/', PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm'),
    # User profile update endpoint
    path('profile/', UserProfileUpdateAPIView.as_view(), name='profile_update'),
]
