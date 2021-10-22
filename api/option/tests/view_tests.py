import pytest
from rest_framework import status


class APIActions:
    @pytest.fixture
    def list_response(self, client, reverse_list, first_question):
        return client.get(reverse_list(question_id=first_question.id))

    @pytest.fixture
    def retrieve_response(self, client, reverse_detail, first_question):
        first_option = first_question.options.first()
        return client.get(
            reverse_detail(question_id=first_question.id, option_id=first_option.id)
        )

    @pytest.fixture
    def update_response(self, client, reverse_detail, first_question, last_question):
        first_option = first_question.options.first()
        return client.put(
            reverse_detail(question_id=first_question.id, option_id=first_option.id),
            {"question": last_question.pk, "product": first_option.pk},
        )

    @pytest.fixture
    def partial_update_response(
        self, client, reverse_detail, first_question, last_question
    ):
        first_option = first_question.options.first()
        return client.put(
            reverse_detail(question_id=first_question.id, option_id=first_option.id),
            {"question": last_question.pk},
        )

    @pytest.fixture
    def delete_response(self, client, reverse_detail, first_question):
        first_option = first_question.options.first()
        return client.delete(
            reverse_detail(question_id=first_question.id, option_id=first_option.id)
        )


class TestAnonymous:
    @pytest.fixture
    def client(self, anonymous_client):
        return anonymous_client

    def test_question_option_list(self, list_response):
        assert list_response.status_code == status.HTTP_200_OK

    def test_retrieve(self, retrieve_response):
        assert retrieve_response.status_code == status.HTTP_200_OK

    def test_create(self, create_response):
        assert retrieve_response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthenticated:
    @pytest.fixture(lambda self, user_client: user_client)
    def test_create(self, create_response):
        assert retrieve_response.status_code == status.HTTP_201_CREATED

    def test_delete(self, delete_response):
        assert retrieve_response.status_code == status.HTTP_403_FORBIDDEN


class TestAdmin:
    @pytest.fixture(lambda self, admin_client: admin_client)
    def test_update(self, update_response):
        assert retrieve_response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete(self, delete_response):
        assert retrieve_response.status_code == status.HTTP_204_NO_CONTENT


class TestPagination:
    @pytest.fixture
    def client(self, user_client):
        return user_client

    def test_list_count(self, list_response, option_count):
        assert list_response.data["count"] == option_count

    def test_next_page(self, list_response):
        assert list_response.data["next"] == None

    def test_previous_page(self, list_response):
        assert list_response.data["previous"] == None

    def test_list_pages_by_10(self, list_response, option_count):
        assert len(list_response.data["results"]) == option_count
