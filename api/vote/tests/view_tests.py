import pytest
from rest_framework import status

from vote.models import Vote


@pytest.mark.django_db
class TestPermission:
    class TestAnonymous:
        def test_list(self, list_response):
            assert list_response.status_code == status.HTTP_200_OK

        def test_read(self, read_response):
            assert read_response.status_code == status.HTTP_200_OK

        def test_create(self, create_response):
            assert create_response.status_code == status.HTTP_401_UNAUTHORIZED

        def test_update(self, update_response):
            assert update_response.status_code == status.HTTP_401_UNAUTHORIZED

        def test_delete(self, delete_response):
            assert delete_response.status_code == status.HTTP_401_UNAUTHORIZED

    class TestUser:
        @pytest.fixture(scope="class")
        def client(self, user_client):
            return user_client

        def test_read(self, read_response):
            assert read_response.status_code == status.HTTP_200_OK

        def test_create(self, create_response):
            assert create_response.status_code == status.HTTP_201_CREATED

        def test_update(self, update_response):
            assert update_response.status_code == status.HTTP_200_OK

        def test_partial_update(self, update_partial_response):
            assert update_partial_response.status_code == status.HTTP_200_OK

        def test_delete(self, delete_response):
            assert delete_response.status_code == status.HTTP_204_NO_CONTENT

    class TestAdmin:
        @pytest.fixture(scope="class")
        def client(admin_client):
            return admin_client

        def test_read(self, read_response):
            assert read_response.status_code == status.HTTP_200_OK

        def test_create(self, create_response):
            assert create_response.status_code == status.HTTP_201_CREATED

        def test_update(self, update_response):
            assert update_response.status_code == status.HTTP_200_OK

        def test_partial_update(self, update_partial_response):
            assert update_partial_response.status_code == status.HTTP_200_OK

        def test_delete(self, delete_response):
            assert delete_response.status_code == status.HTTP_204_NO_CONTENT


class TestRouter:
    @pytest.fixture(scope="class")
    def client(self, user_client):
        return user_client

    @pytest.fixture(scope="class")
    def list_url(self, q, o):
        return f"/api/questions/{q.pk}/options/{o.pk}/votes/"

    @pytest.fixture(scope="class")
    def detail_url(self, q, o, v):
        return reverse(
            "vote-detail", kwargs={"question_pk": q.pk, "option_pk": o.pk, "pk": v.pk}
        )

    @pytest.fixture(
        params=[
            "list_response",
            "read_response",
            "create_response",
            "update_response",
            "update_partial_response",
            "delete_response",
        ]
    )
    def response(self, request):
        return request.getfixturevalue(request.param)

    def test_response(self, response):
        assert response.status_code != status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestAPI:
    @pytest.fixture
    def client(self, user_client):
        return user_client

    def test_list(self, v, list_response):
        assert len(list_response.data) == 1
        assert list_response.data[0]["pk"] == v.pk

    def test_read(self, v, read_response):
        assert read_response["pk"] == v.pk
        assert read_response["up"] == v.up
        assert read_response.get("option") is None
        assert read_response.get("user") is None

    def test_create(self, create_response, vote_data):
        assert Vote.objects.count() == 1
        v = Vote.objects.latest()
        assert v.option.pk == vote_data["option"]
        assert v.user.pk == vote_data["user"]
        assert v.up == vote_data["up"]

    def test_update(self, v, update_response):
        v = Vote.objects.get(pk=v.pk)
        assert v.up == False

    def test_partial_update(self, v, update_partial_response):
        v = Vote.objects.get(pk=v.pk)
        assert v.up == False

    def test_delete(self, v, delete_response):
        with pytest.raises(Vote.DoesNotExist):
            Vote.objects.get(pk=v.pk)
