import random
import string

import pytest


@pytest.fixture
def setup_db(create_question):
    random.seed(325)

    def get_title():
        return "".join([random.choice(string.ascii_letters) for _ in range(50)])

    for _ in range(70):
        create_question(title=get_title())

    yield


@pytest.mark.django_db
def test_3_pages(setup_db, api_client, list_url):
    response = api_client.get(list_url)
    assert response.data["count"] == 70
    assert response.data["next"] is not None
    assert response.data["previous"] is None
    assert len(response.data["results"]) == 30

    response = api_client.get(response.data["next"])
    assert response.data["next"] is not None
    assert response.data["previous"] is not None
    assert len(response.data["results"]) == 30

    response = api_client.get(response.data["next"])
    assert response.data["next"] is None
    assert response.data["previous"] is not None
    assert len(response.data["results"]) == 10
