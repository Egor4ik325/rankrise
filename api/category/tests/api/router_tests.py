import pytest
from rest_framework import status


@pytest.fixture
def category(c4):
    return c4


@pytest.fixture
def list_url():
    return "/api/categories/"


@pytest.fixture
def detail_url(category):
    return f"/api/categories/{category.pk}/"


@pytest.fixture
def client(anonymous_client):
    return anonymous_client


@pytest.mark.django_db
class TestUrlConf:
    """Test URL patterns exist (are found) and are right."""

    def test_list_url(self, list_response):
        assert list_response.status_code != status.HTTP_404_NOT_FOUND

    def test_detail_url(self, retrieve_response):
        assert retrieve_response.status_code != status.HTTP_404_NOT_FOUND
