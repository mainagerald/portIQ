import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from unittest import mock

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_registration_sends_verification_email(api_client):
    """
    Test that registration creates a user and sends a verification email.
    Email sending is mocked to avoid real emails.
    """
    with mock.patch('django.core.mail.send_mail') as mock_send_mail:
        data = {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'newpass123'}
        resp = api_client.post('/api/auth/register/', data)
        assert resp.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser').exists()
        # Check that send_mail was called
        assert mock_send_mail.called
        # The user should not be verified yet
        user = User.objects.get(username='newuser')
        assert user.email_verified is False

@pytest.mark.django_db
def test_email_verification_flow(api_client):
    """
    Test that the email verification endpoint sets email_verified=True.
    """
    user = User.objects.create_user(username='verifyme', email='verifyme@example.com', password='pass123', email_verified=False)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    url = f'/api/auth/verify-email/{uid}/{token}/'
    resp = api_client.get(url)
    assert resp.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.email_verified is True

@pytest.mark.django_db
def test_jwt_token_obtain_and_refresh(api_client):
    """
    Test JWT obtain and refresh with a verified user.
    """
    User.objects.create_user(username='authuser', password='authpass123', email='auth@example.com', email_verified=True)
    resp = api_client.post(reverse('token_obtain_pair'), {'username': 'authuser', 'password': 'authpass123'})
    assert resp.status_code == status.HTTP_200_OK
    assert 'access' in resp.data
    assert 'refresh' in resp.data
    # Refresh token
    refresh = resp.data['refresh']
    resp2 = api_client.post(reverse('token_refresh'), {'refresh': refresh})
    assert resp2.status_code == status.HTTP_200_OK
    assert 'access' in resp2.data

@pytest.mark.django_db
def test_user_profile_protected(api_client):
    """
    Test that protected endpoints require authentication.
    """
    user = User.objects.create_user(username='profileuser', password='profilepass', email='profile@example.com', email_verified=True)
    # Try to access a protected endpoint without auth
    resp = api_client.get('/api/stocks/')
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    # Login and access
    token_resp = api_client.post(reverse('token_obtain_pair'), {'username': 'profileuser', 'password': 'profilepass'})
    token = token_resp.data['access']
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    resp2 = api_client.get('/api/stocks/')
    # Should be allowed now (even if empty list)
    assert resp2.status_code == status.HTTP_200_OK

