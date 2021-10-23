import pytest
from django.db.models import Max
from django.urls import reverse

from question.models import Question
from product.models import Product
from option.models import Option


@pytest.fixture
def q():
    return Question.objects.create(title="Test question?")


@pytest.fixture
def p():
    return Product.objects.create(name="TestProduct")


@pytest.fixture
def o(q, p):
    return Option.objects.create(question=q, product=p)


@pytest.fixture
def option_data(q, p):
    return {"question": q.pk, "product": p.pk}


@pytest.fixture
def reverse_list():
    return lambda **kwargs: reverse(
        "option-list", kwargs={"question_pk": kwargs["question_pk"]}
    )


@pytest.fixture
def reverse_detail():
    return lambda **kwargs: reverse(
        "option-detail",
        kwargs={"question_pk": kwargs["question_pk"], "pk": kwargs["pk"]},
    )


@pytest.fixture(scope="function")
def setup_database():
    q1 = Question.objects.create(title="What is the best game?")
    q2 = Question.objects.create(title="What is the best operaing system?")
    p1 = Product.objects.create(name="Minecraft")
    p2 = Product.objects.create(name="Terraria")
    p3 = Product.objects.create(name="Starbound")
    p4 = Product.objects.create(name="macOS")
    p5 = Product.objects.create(name="Windows")
    p6 = Product.objects.create(name="GNU/Linux")
    o1 = Option.objects.create(question=q1, product=p1)
    o2 = Option.objects.create(question=q2, product=p4)
    o3 = Option.objects.create(question=q2, product=p6)
    yield


@pytest.fixture
def first_question(setup_database):
    return Question.objects.first()


@pytest.fixture
def last_question(setup_database):
    return Question.objects.last()


@pytest.fixture
def option_count(first_question):
    return first_question.options.count()


@pytest.fixture
def max_question_id(setup_database):
    return Question.objects.aggregate(Max("id"))["id__max"]


@pytest.fixture
def max_product_id(setup_database):
    return Product.objects.aggregate(Max("id"))["id__max"]
