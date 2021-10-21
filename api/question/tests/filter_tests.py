import pytest


@pytest.fixture
def setup_db(create_question):
    return [
        create_question(title="What is the best Android gallery app?"),
        create_question(title="Which service will I choose to deploy Python microapp?"),
        create_question(title="What is the best Python web framework?"),
        create_question(title="Most popular blogging CMS for business?"),
    ]


@pytest.mark.django_db
def test_default_ordering(setup_db, api_client, list_url):
    response = api_client.get(list_url)
    assert response.data["count"] == 4
    for i in range(4):
        assert response.data["results"][i]["pk"] == setup_db[-i - 1].pk


@pytest.mark.django_db
def test_search_title(setup_db, api_client, list_url):
    response = api_client.get(list_url, {"search": "Python"})
    assert response.data["count"] == 2
    results = response.data["results"]
    assert "Python" in results[0]["title"]
    assert "Python" in results[1]["title"]
