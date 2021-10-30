"""
Test allow-any permission.
"""
import pytest
from rest_framework import status


@pytest.fixture
def category(self, c4):
    return c4


@pytest.mark.parametrize(
    "response_fixture,status_code",
    [
        ("list_response", status.HTTP_200_OK),
        ("retrieve_response", status.HTTP_200_OK),
        ("create_response", status.HTTP_405_METHOD_NOT_ALLOWED),
        ("update_response", status.HTTP_405_METHOD_NOT_ALLOWED),
        ("partial_update_response", status.HTTP_405_METHOD_NOT_ALLOWED),
        ("delete_response", status.HTTP_405_METHOD_NOT_ALLOWED),
    ],
)
class TestRole:
    class TestAnonymous:
        """Test unauthenticated client has or hasn't specific resource access.
        Test response status code."""

        @pytest.fixture
        def client(self, anonymous_client):
            return anonymous_client

        def test_response(self, request, response_fixture, status_code):
            response = request.getfixturevalue(response_fixture)
            assert response.status_code == status_code

    class TestUser:
        """Test authenticated client rights (authorization), status code."""

        @pytest.fixture
        def client(self, user_client):
            return user_client

        def test_response(self, request, response_fixture, status_code):
            response = request.getfixturevalue(response_fixture)
            assert response.status_code == status_code
