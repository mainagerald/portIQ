from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
import requests
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
import os

User = get_user_model()

# --- User Registration Endpoint with Email Verification ---
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    """Register a new user and send an email verification link."""
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        if not all([username, email, password]):
            return Response({'detail': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({'detail': 'User with that username or email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email, password=password, email_verified=False)
        user.save()
        # Send email verification
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verify_url = request.build_absolute_uri(reverse('verify_email', kwargs={'uidb64': uid, 'token': token}))
        subject = 'Verify your email for Tradez'
        message = f'Hi {username},\n\nPlease verify your email by clicking the link below:\n{verify_url}\n\nThank you!'
        sender = os.getenv('EMAIL_HOST_USER', 'no-reply@example.com')
        send_mail(subject, message, sender, [email], fail_silently=False)
        return Response({'detail': 'Registration successful. Please check your email to verify your account.'}, status=status.HTTP_201_CREATED)

# --- Custom JWT Token View with extra claims ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['email_verified'] = user.email_verified
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- Email Verification Endpoint ---
class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]
    """Verify user email using uid and token from email link."""
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user and default_token_generator.check_token(user, token):
            user.email_verified = True
            user.save()
            return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

# --- Password Reset Request Endpoint ---
class PasswordResetRequestAPIView(APIView):
    permission_classes = [AllowAny]
    """Request a password reset email."""
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Missing email.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with that email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = request.build_absolute_uri(reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token}))
        subject = 'Reset your password for Tradez'
        message = f'Hi {user.username},\n\nPlease reset your password by clicking the link below:\n{reset_url}\n\nThank you!'
        sender = os.getenv('EMAIL_HOST_USER', 'no-reply@example.com')
        send_mail(subject, message, sender, [email], fail_silently=False)
        return Response({'detail': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)

# --- Password Reset Confirm Endpoint ---
class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    """Confirm password reset using uid and token from email link."""
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user and default_token_generator.check_token(user, token):
            password = request.data.get('password')
            if not password:
                return Response({'detail': 'Missing password.'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(password)
            user.save()
            return Response({'detail': 'Password reset successfully.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

# --- Google OAuth2 Login Endpoint ---
class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]
    """Login or register user using Google OAuth2 token."""
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'detail': 'Missing token.'}, status=status.HTTP_400_BAD_REQUEST)
        # Verify token with Google
        google_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={token}'
        resp = requests.get(google_url)
        if resp.status_code != 200:
            return Response({'detail': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)
        info = resp.json()
        email = info.get('email')
        if not email:
            return Response({'detail': 'Google account missing email.'}, status=status.HTTP_400_BAD_REQUEST)
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email.split('@')[0],
            'email_verified': True,
        })
        # Optionally update user fields from Google info
        if created:
            user.set_unusable_password()
            user.save()
        # Generate JWT token for user
        serializer = CustomTokenObtainPairSerializer(data={'username': user.username, 'password': None})
        serializer.is_valid(raise_exception=False)
        token = serializer.get_token(user)
        return Response({'access': str(token.access_token), 'refresh': str(token)}, status=status.HTTP_200_OK)

