import pytest
from rest_framework import status


@pytest.fixture
def list_response(client, reverse_list, first_question):
    return client.get(reverse_list(question_pk=first_question.pk))


@pytest.fixture
def retrieve_response(client, reverse_detail, first_question):
    first_option = first_question.options.first()
    return client.get(reverse_detail(question_pk=first_question.pk, pk=first_option.pk))


@pytest.fixture
def create_response(client, reverse_list, first_question, p):
    return client.post(reverse_list(question_pk=first_question.pk), {"product": p.pk})


@pytest.fixture
def update_response(client, reverse_detail, first_question, last_question):
    first_option = first_question.options.first()
    return client.put(
        reverse_detail(question_pk=first_question.pk, pk=first_option.pk),
        {"question": last_question.pk, "product": first_option.pk},
    )


@pytest.fixture
def partial_update_response(client, reverse_detail, first_question, last_question):
    first_option = first_question.options.first()
    return client.put(
        reverse_detail(question_pk=first_question.pk, pk=first_option.pk),
        {"question": last_question.pk},
    )


@pytest.fixture
def delete_response(client, reverse_detail, first_question):
    first_option = first_question.options.first()
    return client.delete(
        reverse_detail(question_pk=first_question.pk, pk=first_option.pk)
    )


class TestAnonymous:
    @pytest.fixture
    def client(self, anonymous_client):
        return anonymous_client

    @pytest.mark.django_db
    def test_question_option_list(self, list_response):
        assert list_response.status_code == status.HTTP_200_OK

    @pytest.mark.django_db
    def test_retrieve(self, retrieve_response):
        assert retrieve_response.status_code == status.HTTP_200_OK

    @pytest.mark.django_db
    def test_create(self, create_response):
        assert create_response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthenticated:
    @pytest.fixture
    def client(self, user_client):
        return user_client

    @pytest.mark.django_db
    def test_create(self, create_response):
        assert create_response.status_code == status.HTTP_201_CREATED

    @pytest.mark.django_db
    def test_delete(self, delete_response):
        assert delete_response.status_code == status.HTTP_403_FORBIDDEN


class TestAdmin:
    @pytest.fixture
    def client(self, admin_client):
        return admin_client

    @pytest.mark.django_db
    def test_update(self, update_response):
        assert update_response.status_code == status.HTTP_403_FORBIDDEN

    @pytest.mark.django_db
    def test_delete(self, delete_response):
        assert delete_response.status_code == status.HTTP_204_NO_CONTENT


class TestPagination:
    @pytest.fixture
    def client(self, user_client):
        return user_client

    @pytest.mark.django_db
    def test_list_count(self, list_response, option_count):
        assert list_response.data["count"] == option_count

    @pytest.mark.django_db
    def test_next_page(self, list_response):
        assert list_response.data["next"] == None

    @pytest.mark.django_db
    def test_previous_page(self, list_response):
        assert list_response.data["previous"] == None

    @pytest.mark.django_db
    def test_list_pages_by_10(self, list_response, option_count):
        assert len(list_response.data["results"]) == option_count
