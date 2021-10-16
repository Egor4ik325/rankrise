import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.mark.django_db
def test_user_can_login(client, django_user_model):
    user = django_user_model.objects.create_user(username="user", password="user")
    url = reverse("rest_login")
    response = client.post(url, {"username": "user", "password": "user"})
    assert response.status_code == 200


@pytest.mark.django_db
def test_user_can_logout(client, django_user_model):
    user = django_user_model.objects.create_user(username="user", password="user")
    client.login(username="user", password="user")
    url = reverse("rest_logout")
    response = client.get(url)
    assert response.status_code != 200
    response = client.post(url)
    assert response.status_code == 200


@pytest.fixture
def api_client(django_user_model):
    user = django_user_model.objects.create_user(username="user", password="user")
    refresh = RefreshToken.for_user(user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.mark.django_db
def test_user_get_details(api_client):
    url = reverse("rest_user_details")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert "user" in response.data.values()
