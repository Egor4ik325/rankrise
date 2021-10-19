"""
1. Arrange (setup fixture)
2. Act (act fixture)
3. Assert (test function/method)
"""
import pytest
from django.urls import reverse
from rest_framework import status
from product.serializers import ProductSerializer
from product.models import Product


@pytest.fixture
def create_product():
    def inner(**kwargs):
        serializer = ProductSerializer(data=kwargs)
        serializer.is_valid()
        serializer.save()

    return create_product


@pytest.fixture
def setup_data(create_product):
    p = create_product(name="Python")
    p2 = create_product(name="JavaScript")
    p3 = create_product(name="Go")
    return [p, p2, p3]


@pytest.fixture
def product_list_url_name():
    return "product-list"


@pytest.fixture
def act_list(product_list_url_name):
    return lambda client, setup_data: client.get(reverse(product_list_url_name))


@pytest.fixture
def act_retrieve():
    return lambda client, setup_data: client.get(setup_data[0].get_absolute_url())


@pytest.fixture
def act_create(product_list_url_name):
    return lambda client, setup_data: client.post(
        reverse(product_list_url_name), {"name": "C++"}
    )


@pytest.fixture
def act_update():
    return lambda client, setup_data: client.put(
        setup_data[0].get_absolute_url(),
        {"name": "Ruby", "description": "Improved Python"},
    )


@pytest.fixture
def act_partial_update():
    return lambda client, setup_data: client.patch(
        setup_data[0].get_absolute_url(),
        {"name": "Ruby"},
    )


@pytest.fixture
def act_delete():
    return lambda client, setup_data: client.delete(setup_data[0].get_absolute_url())


class TestUnAuthenticated:
    def test_list(self, setup_data, act_list, anonymous_api_client):
        response = act_list(anonymous_api_client, setup_data)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == len(setup_data)

    def test_retrieve(self, setup_data, act_retrieve, anonymous_api_client):
        response = test_retrieve(anonymous_api_client)
        assert response.status_code == status.HTTP_200_OK
        assert response.data.pk == setup_data[0].pk

    def test_create(self, setup_data, act_create, anonymouse_api_client):
        response = act_create(anonymouse_api_client, setup_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update(self, setup_data, act_update, anonymouse_api_client):
        response = act_update(anonymouse_api_client, setup_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_partial_update(
        self, setup_data, act_partial_update, anonymouse_api_client
    ):
        response = act_partial_update(anonymouse_api_client, setup_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete(self, setup_data, act_delete, anonymouse_api_client):
        response = act_delete(anonymouse_api_client, setup_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthenticated:
    def test_create(self, setup_data, act_create, authenticated_api_client):
        response = act_create(authenticated_api_client, setup_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["pk"] == Product.objects.last().pk

    def test_update(self, setup_data, act_update, authenticated_api_client):
        response = act_update(authenticated_api_client, setup_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_partial_update(
        self, setup_data, act_partial_update, authenticated_api_client
    ):
        response = act_partial_update(authenticated_api_client, setup_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete(self, setup_data, act_delete, authenticated_api_client):
        response = act_delete(authenticated_api_client, setup_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestStaff:
    def test_update(self, setup_data, act_update, staff_api_client):
        response = act_update(staff_api_client, setup_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_partial_update(self, setup_data, act_partial_update, staff_api_client):
        response = act_partial_update(staff_api_client, setup_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete(self, setup_data, act_delete, staff_api_client):
        response = act_delete(staff_api_client, setup_data)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        with pytest.raises(Product.DoesNotExist):
            Product.objects.get(setup_data[0].pk)
