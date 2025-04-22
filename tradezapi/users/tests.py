import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_jwt_token_obtain_and_refresh(api_client):
    # Create user
    User.objects.create_user(username='authuser', password='authpass123', email='auth@example.com', email_verified=True)
    # Obtain token
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
    # Create user
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

