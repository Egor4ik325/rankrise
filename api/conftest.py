import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(django_user_model):
    return django_user_model.objects.create_user(
        username="user", email="user@email.com", password="user"
    )


@pytest.fixture
def test_admin(django_user_model):
    return django_user_model.objects.create_user(
        username="admin", email="admin@email.com", password="admin", is_staff=true
    )


@pytest.fixture
def create_api_client(api_client):
    def make_api_client(user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return api_client

    return make_api_client


@pytest.fixture
def anonymous_client(api_client):
    return api_client


@pytest.fixture
def user_client(create_api_client, test_user):
    return create_api_client(test_user)


@pytest.fixture
def admin_client(create_api_client, test_admin):
    return create_api_client(test_admin)