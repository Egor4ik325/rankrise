import pytest


@pytest.mark.django_db
def test_model_fields(q, p, o):
    Option.objects.get(pk=o.pk)
    assert o.question.pk == q.pk
    assert o.product.pk == p.pk


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
    assert o.product == None
