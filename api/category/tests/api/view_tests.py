import pytest


class TestActions:
    """Test API method + URL (view action) is allowed or not allowed."""

    # Already tested in permissions


@pytest.fixture
def category(c4):
    return c4


@pytest.mark.django_db
class TestContent:
    """Test the response content is valid."""

    def test_list(self, c, list_response):
        """Test only root elements are being displayed."""
        results = list_response.data["results"]
        assert len(results) == 1
        assert results[0]["pk"]

    class TestPagination:
        """Test the response content is broken into pages."""

        def test_list(self, c, list_response):
            assert (
                list_response.data["count"] == 1
            ), "Only the root category should be returned"
            assert list_response.data["next"] is None
            assert list_response.data["previous"] is None

        def test_list_pages(self, c, setup_categories, list_response):
            assert list_response.data["count"] == 31
            assert len(list_response.data["results"]) == 20
            assert list_response.data["next"] is not None
            assert list_response.data["previous"] is None

    class TestFilters:
        """Test API filters are working."""

        @pytest.fixture
        def parent(self, c):
            return c.pk

        def test_list(self, c2, c3, list_response_filter):
            assert list_response_filter.data["count"] == 2
            results = list_response_filter.data["results"]
            assert results[0]["pk"] == c2.pk
            assert results[1]["pk"] == c3.pk

    class TestSearch:
        """Test API search is working."""

        @pytest.fixture
        def query(self):
            return "development"

        def test_search_name(self, c, c2, c3, c4, list_response_search):
            assert (
                list_response_search.data["count"] == 3
            ), 'Response should contain 3 categories matching "development" query'
            results = list_response_search.data["results"]
            assert results[0]["pk"] == c.pk
            assert results[1]["pk"] == c3.pk
            assert results[2]["pk"] == c4.pk
