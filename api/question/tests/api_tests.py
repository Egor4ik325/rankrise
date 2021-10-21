import pytest
from question.models import Question
from rest_framework import status


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
    assert response.status_code == status.HTTP_204_NO_CONTENT
    with pytest.raises(Question.DoesNotExist):
        Question.objects.get(pk=q.pk)


@pytest.mark.django_db
def test_user_delete_user(create_question, user_api_client, detail_url):
    q = create_question(title="What is the test title?")
    response = user_api_client.delete(detail_url(q.pk))
    assert response.status_code == status.HTTP_403_FORBIDDEN


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
    assert response.status_code == status.HTTP_403_FORBIDDEN
