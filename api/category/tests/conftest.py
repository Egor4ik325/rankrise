import pytest
from django.urls import reverse
from string import ascii_letters

from category.models import Category


@pytest.fixture
def c():
    return Category.objects.create(name="Software Development", parent=None)


@pytest.fixture
def c2(c):
    return Category.objects.create(name="Databases", parent=c)


@pytest.fixture
def c3(c):
    return Category.objects.create(name="Web Development", parent=c)


@pytest.fixture
def c4(c3):
    """Same as category_data fixture."""
    return Category.objects.create(name="CMS development", parent=c3)


@pytest.fixture
def setup_categories():
    """Setup 30 different categories for testing."""
    for i in range(30):
        Category.objects.create(name=f"Test Category {ascii_letters[i]}", parent=None)


@pytest.fixture
def category_data(c3):
    """Test data to make changes for validation or customization (testing)."""
    return {"name": "CMS development", "parent": c3}


def updated_category_data(category_data):
    return {**category_data, name: "Fullstack development"}


def partial_update_category_data(updated_category_data):
    return {"name": updated_category_data["name"]}


def list_url():
    return reverse("category-list")


def detail_url(category):
    """category fixture should be defined or overriden from calling class/module."""
    return reverse("category-list", kwargs={"pk": c4.pk})


def client(anonymous_api_client):
    """client fixture can be overriden in module/class"""
    return anonymous_api_client


def list_response(client, list_url):
    return client.get(list_url)


def retrieve_response(client, detail_url):
    return client.get(detail_url)


def create_response(client, list_url, category_data):
    return client.post(list_url, category_data)


def update_response(client, detail_url, updated_category_data):
    return client.put(detail_url, updated_category_data)


def partial_update_response(client, detail_url, partial_update_category_data):
    return client.patch(detail_url, updated_category_data)


def delete_response(client, detail_url):
    return client.delete(detail_url)


def list_response_filter(client, list_url, parent):
    return client.get(list_url, {"parent": parent})


def list_response_search(client, list_url, query):
    return client.get(list_url, {"search": query})
