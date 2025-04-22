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
import random
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import permission_classes

User = get_user_model()

def generate_witty_username():
    """Generate a random witty username for new users."""
    adjectives = [
        'Amazing', 'Brilliant', 'Clever', 'Dazzling', 'Eager', 'Fantastic', 'Glorious', 'Happy', 'Incredible',
        'Jolly', 'Kind', 'Lucky', 'Magical', 'Noble', 'Optimistic', 'Powerful', 'Quick', 'Radiant', 'Smart',
        'Talented', 'Unique', 'Vibrant', 'Witty', 'Xcellent', 'Youthful', 'Zealous', 'Brave', 'Charming',
        'Dynamic', 'Energetic', 'Fearless', 'Graceful', 'Honest', 'Innovative', 'Joyful', 'Keen', 'Lively',
        'Magnificent', 'Nimble', 'Outstanding', 'Passionate', 'Quirky', 'Remarkable', 'Spectacular', 'Thoughtful'
    ]
    
    nouns = [
        'Trader', 'Investor', 'Guru', 'Wizard', 'Master', 'Genius', 'Expert', 'Sage', 'Champion', 'Titan',
        'Mogul', 'Tycoon', 'Pioneer', 'Virtuoso', 'Prodigy', 'Maverick', 'Shark', 'Eagle', 'Lion', 'Wolf',
        'Dolphin', 'Phoenix', 'Dragon', 'Tiger', 'Falcon', 'Hawk', 'Owl', 'Fox', 'Panther', 'Jaguar',
        'Voyager', 'Explorer', 'Navigator', 'Captain', 'Pilot', 'Astronaut', 'Adventurer', 'Discoverer',
        'Strategist', 'Tactician', 'Analyst', 'Planner', 'Architect', 'Builder', 'Creator', 'Innovator'
    ]
    
    # Generate a random number to make the username more unique
    random_number = random.randint(1, 999)
    
    # Combine adjective, noun, and number to create a username
    username = f"{random.choice(adjectives)}{random.choice(nouns)}{random_number}"
    
    return username

# --- User Registration Endpoint with Email Verification ---
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    """Register a new user and send an email verification link."""
    def post(self, request):
        import logging
        logger = logging.getLogger('django')
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        logger.info(f"[Register] Received registration for username={username}, email={email}")
        if not all([username, email, password]):
            logger.warning("[Register] Missing required fields.")
            return Response({'detail': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            logger.warning("[Register] User with that username or email already exists.")
            return Response({'detail': 'User with that username or email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.create_user(username=username, email=email, password=password, email_verified=False)
            user.save()
            logger.info(f"[Register] Created user {username} ({email})")
        except Exception as e:
            logger.error(f"[Register] Error creating user: {e}")
            return Response({'detail': f'Error creating user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # Send email verification
        try:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            verify_url = request.build_absolute_uri(reverse('verify_email', kwargs={'uidb64': uid, 'token': token}))
            subject = 'Verify your email for Tradez'
            message = f'Hi {username},\n\nPlease verify your email by clicking the link below:\n{verify_url}\n\nThank you!'
            sender = os.getenv('EMAIL_HOST_USER', 'no-reply@example.com')
            logger.info(f"[Register] Sending verification email to {email} via sender {sender}")
            send_mail(subject, message, sender, [email], fail_silently=False)
            logger.info(f"[Register] Verification email sent to {email}")
        except Exception as e:
            logger.error(f"[Register] Error sending verification email: {e}")
            return Response({'detail': f'Error sending verification email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
    """Login or register user using Google OAuth2.
    
    GET without code: Initiates the OAuth flow by redirecting to Google's consent page
    GET with code: Handles the callback from Google after user authentication
    POST: Processes the OAuth token directly (alternative flow)
    """
    
    def get(self, request):
        # Check if this is a callback from Google (will have a 'code' parameter)
        code = request.query_params.get('code')
        
        if code:
            # This is a callback from Google, process the authorization code
            return self._handle_callback(request, code)
        else:
            # This is the initial request, redirect to Google's consent page
            return self._initiate_oauth_flow(request)
    
    def _initiate_oauth_flow(self, request):
        """Redirect to Google OAuth consent page"""
        # Google OAuth2 configuration
        client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
        redirect_uri = os.getenv('GOOGLE_OAUTH_REDIRECT_URI', f"http://{request.get_host()}/api/auth/google-login/")
        
        if not client_id:
            return Response({
                'detail': 'Google OAuth is not configured. Please set GOOGLE_OAUTH_CLIENT_ID in environment variables.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Build the authorization URL
        auth_url = (
            "https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={client_id}&"
            "response_type=code&"
            f"redirect_uri={redirect_uri}&"
            "scope=openid%20email%20profile&"
            "access_type=offline"
        )
        
        # Use HttpResponseRedirect for proper redirection
        from django.http import HttpResponseRedirect
        return HttpResponseRedirect(auth_url)
    
    def _handle_callback(self, request, code):
        """Handle the callback from Google OAuth2 authorization."""
        # Google OAuth2 configuration
        client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
        redirect_uri = os.getenv('GOOGLE_OAUTH_REDIRECT_URI', f"http://{request.get_host()}/api/auth/google-login/")
        frontend_url = os.getenv('FRONTEND_URL_LOCAL', 'http://localhost:5173')
        
        if not client_id or not client_secret:
            return Response({
                'detail': 'Google OAuth is not configured. Please set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in environment variables.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Exchange the authorization code for tokens
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }
        
        token_response = requests.post(token_url, data=token_data)
        if token_response.status_code != 200:
            error_message = f"Failed to exchange authorization code for tokens: {token_response.text}"
            print(error_message)  # Log the error
            return Response({'detail': error_message}, status=status.HTTP_400_BAD_REQUEST)
            
        token_json = token_response.json()
        id_token = token_json.get('id_token')
        
        # Get user info from the ID token
        user_info_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
        user_info_response = requests.get(user_info_url)
        if user_info_response.status_code != 200:
            return Response({'detail': 'Failed to get user info from ID token.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user_info = user_info_response.json()
        email = user_info.get('email')
        if not email:
            return Response({'detail': 'Google account missing email.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Generate a witty username instead of using email prefix
        witty_username = generate_witty_username()
        
        # Check if the generated username already exists
        while User.objects.filter(username=witty_username).exists():
            witty_username = generate_witty_username()
        
        # Get or create user with the witty username
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': witty_username,
            'email_verified': True,
        })
        
        # Update user fields if needed
        if created:
            user.set_unusable_password()
            user.save()
            
        # Generate JWT token for user
        serializer = CustomTokenObtainPairSerializer(data={'username': user.username, 'password': None})
        serializer.is_valid(raise_exception=False)
        token = serializer.get_token(user)
        access_token = str(token.access_token)
        refresh_token = str(token)
        
        # Redirect to frontend with tokens
        redirect_url = f"{frontend_url}/login?access_token={access_token}&refresh_token={refresh_token}&user_id={user.id}&username={user.username}&email={email}"
        
        # Use HttpResponseRedirect for proper redirection
        from django.http import HttpResponseRedirect
        return HttpResponseRedirect(redirect_url)
    
    def post(self, request):
        """Process the OAuth token directly (alternative flow)"""
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
            
        # Generate a witty username instead of using email prefix
        witty_username = generate_witty_username()
        
        # Check if the generated username already exists
        while User.objects.filter(username=witty_username).exists():
            witty_username = generate_witty_username()
        
        # Get or create user with the witty username
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': witty_username,
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
        
        # Return tokens
        return Response({
            'access': str(token.access_token), 
            'refresh': str(token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'email_verified': user.email_verified
            }
        }, status=status.HTTP_200_OK)

# This class has been replaced by the updated GoogleLoginAPIView
# which now handles both the initial flow and the callback


# --- User Profile Update Endpoint ---
class UserProfileUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    """Update user profile information."""
    
    def patch(self, request):
        user = request.user
        data = request.data
        
        # Fields that can be updated
        allowed_fields = ['username', 'first_name', 'last_name']
        
        # Update user fields
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        try:
            user.save()
            # Return updated user data
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email_verified': user.email_verified,
                'provider': getattr(user, 'provider', 'email'),
                'profile_picture': getattr(user, 'profile_picture', None),
                'roles': ['user']  # Default role, can be expanded later
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

