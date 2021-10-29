import pytest
from django.urls import reverse
from question.models import Question
from question.serializers import QuestionSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(django_user_model):
    return django_user_model.objects.create_user(
        username="user", email="user@email.com", password="user"
    )


@pytest.fixture
def test_user2(django_user_model):
    return django_user_model.objects.create_user(
        username="user2", email="user2@email.com", password="user2"
    )


@pytest.fixture
def test_admin(django_user_model):
    return django_user_model.objects.create_user(
        username="admin", email="admin@email.com", password="admin", is_staff=True
    )


@pytest.fixture
def authenticate_api_client(api_client):
    def make_client(user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return api_client

    return make_client


@pytest.fixture
def user_api_client(authenticate_api_client, test_user):
    return authenticate_api_client(test_user)


@pytest.fixture
def user_api_client2(authenticate_api_client, test_user2):
    return authenticate_api_client(test_user2)


@pytest.fixture
def admin_api_client(authenticate_api_client, test_admin):
    return authenticate_api_client(test_admin)


@pytest.fixture
def list_url():
    return reverse("question-list")


@pytest.fixture
def detail_url():
    return lambda *args: reverse("question-detail", args=args)


@pytest.fixture
def create_question():
    def make_question(**kwargs):
        serializer = QuestionSerializer(data=kwargs)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    return make_question
