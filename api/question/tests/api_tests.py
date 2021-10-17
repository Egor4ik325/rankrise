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
def admin_api_client(authenticate_api_client, test_admin):
    return authenticate_api_client(test_admin)


@pytest.fixture
def create_question():
    def make_question(**kwargs):
        serializer = QuestionSerializer(data=kwargs)
        return serializer.save()

    return make_question


@pytest.fixture
def list_url():
    return reverse("question-list")


@pytest.fixture
def detail_url():
    return lambda *args: reverse("question-detail", *args)


def test_user_can_ask_question_authenticated(user_api_client, list_url):
    response = user_api_client.post(
        list_url, {"title": "What is the cheapest hosting?"}
    )
    assert response.status_code == status.HTTP_201_CREATED


def test_user_cant_ask_question_unauth(api_client, list_url):
    response = api_client.post(list_url, {"title": "What is the cheapest hosting?"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_can_list_questions(create_question, user_api_client, list_url):
    q = create_question(title="Best service for hosting simple Python webapps?")
    q2 = create_question(title="Best localization framework for webapps?")
    response = user_api_client.get(list_url)
    assert response.status_code == status.HTTP_200_OK
    content = response.content.decode(response.charset)
    assert q.title in content and q2.title in content


@pytest.mark.django_db
def test_unauth_can_list_questions(create_question, api_client, list_url):
    q = create_question(title="Best service for hosting simple Python webapps?")
    q2 = create_question(title="Best localization framework for webapps?")
    response = api_client.get(list_url)
    assert response.status_code == status.HTTP_200_OK
    content = response.content.decode(response.charset)
    assert q.title in content and q2.title in content


@pytest.mark.django_db
def test_unauth_can_retrieve_question(create_question, api_client, detail_url):
    q = create_question(title="Best service for hosting simple Python webapps?")
    response = api_client.get(detail_url(q.pk))
    assert response.status_code == status.HTTP_200_OK
    assert q.title in response.content.decode(response.charset)


@pytest.mark.django_db
def test_admin_delete_user(create_question, admin_api_client, detail_url):
    q = create_question(title="What is the test title?")
    response = admin_api_client.delete(detail_url(q.pk))
    assert response.status_code == status.HTTP_200_OK
    with pytest.raises(Question.DoesNotExists):
        Question.objects.get(pk=q.pk)


@pytest.mark.django_db
def test_user_delete_user(create_question, user_api_client, detail_url):
    q = create_question(title="What is the test title?")
    response = user_api_client.delete(detail_url(q.pk))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_admin_update_user(create_question, admin_api_client, detail_url):
    q = create_question(title="What is the test title?")
    update_title = "New question title?"
    response = admin_api_client.patch(detail_url(q.pk), {"title": update_title})
    assert response.status_code == status.HTTP_200_OK
    assert Question.objects.get(pk=q.pk).title == update_title


@pytest.mark.django_db
def test_user_update_user(create_question, user_api_client, detail_url):
    q = create_question(title="What is the test title?")
    update_title = "New question title?"
    response = user_api_client.patch(detail_url(q.pk), {"title": update_title})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
