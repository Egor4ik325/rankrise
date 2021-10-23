import pytest
from option.models import Option
from product.models import Product


@pytest.mark.django_db
def test_model_fields(q, p, o):
    assert o.question.pk == q.pk
    assert o.product.pk == p.pk


# TODO: related_name / fk_field tests
def test_question_related_manager():
    pass


def test_product_related_manager():
    pass


@pytest.mark.django_db
def test_question_on_delete_cascade(q, p, o):
    Option.objects.get(pk=o.pk)
    q.delete()
    assert Product.objects.filter(pk=p.pk).exists()
    with pytest.raises(Option.DoesNotExist):
        Option.objects.get(pk=o.pk)


@pytest.mark.django_db
def test_product_on_delete_set_null(q, p, o):
    Option.objects.get(pk=o.pk)
    p.delete()
    o = Option.objects.get(pk=o.pk)
    assert o.product == None
