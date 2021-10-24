import pytest
from django.urls import reverse

from question.models import Question
from product.models import Product
from option.models import Option
from vote.models import Vote


@pytest.fixture
def q():
    return Question.objects.create(title="Test question?")


@pytest.fixture
def p():
    return Product.objects.create(name="TestProduct", website="testproduct.com")


@pytest.fixture
def o(q, p):
    return Option.objects.create(question=q, product=p)


@pytest.fixture
def u(test_user):
    return test_user


@pytest.fixture
def v(o, u):
    return Vote.objects.create(option=o, user=u, up=True)


@pytest.fixture
def v_data(o, u):
    return {"option": o.pk, "user": u.pk, "up": True}


@pytest.fixture(scope="module")
def client(anonymous_client):
    return anonymous_client


@pytest.fixture(scope="module")
def list_url(q, o):
    return reverse("vote-list", kwargs={"question_pk": q.pk, "option_pk": o.pk})


@pytest.fixture(scope="module")
def detail_url(q, o, v):
    return reverse(
        "vote-detail", kwargs={"question_pk": q.pk, "option_pk": o.pk, "pk": v.pk}
    )


@pytest.fixture(scope="module")
def list_response(client, list_url):
    return client.get(list_url)


@pytest.fixture(scope="module")
def read_response(client, detail_url):
    return client.get(detail_url)


@pytest.fixture(scope="module")
def create_response(client, list_url, v_data):
    return client.post(list_url, v_data)


@pytest.fixture(scope="module")
def update_response(client, detail_url, v_data):
    v_data["vote"] = False
    return client.put(detail_url, v_data)


@pytest.fixture(scope="module")
def update_partial_response(client, detail_url):
    return client.patch(detail_url, {"up": False})


@pytest.fixture(scope="module")
def delete_response(client, detail_url):
    return client.delete(detail_url)
