import pytest
from django.urls import reverse
from rest_framework import status
from product.models import PriceChoices


@pytest.fixture
def setup_db(create_product):
    create_product(
        name="AWS Codestar",
        description="As an alternative you can use Google Cloud platform",
        price=PriceChoices.OPEN_SOURCE,
    )
    create_product(name="AWS Lightsail", price=PriceChoices.PAID)
    create_product(name="Heroku PostgreSQL", price=PriceChoices.PAID)
    create_product(
        name="Heroku Redis",
        description="Find more using Google search!",
        price=PriceChoices.OPEN_SOURCE,
    )
    create_product(name="Google", price=PriceChoices.FREE)
    create_product(name="Google Youtube", price=PriceChoices.PAID)
    yield


@pytest.mark.django_db
def test_name_search(setup_db, api_client, product_list_url_name):
    response = api_client.get(reverse(product_list_url_name), {"search": "Heroku"})
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 2


@pytest.mark.django_db
def test_filter_by_price(setup_db, api_client, product_list_url_name):
    response = api_client.get(reverse(product_list_url_name), {"price": "P"})
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 3


# TODO: mark skip (PostgreSQL required)
@pytest.mark.django_db
def test_description_full_search(setup_db, api_client, product_list_url_name):
    response = api_client.get(reverse(product_list_url_name), {"search": "Google"})
    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 4
