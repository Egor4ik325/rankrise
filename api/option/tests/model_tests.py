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


@pytest.mark.django_db
class TestOptionScore:
    def test_ordering(self, q, client, reverse_list):
        p1 = Product.objects.create(name="Product1")
        p2 = Product.objects.create(name="Product2")
        p3 = Product.objects.create(name="Product3")
        o1 = Option.objects.create(question=q, product=p1)
        o2 = Option.objects.create(question=q, product=p2)
        o3 = Option.objects.create(question=q, product=p3)

        for _ in range(12):
            o1.votes.create(user=None, up=True)
        for _ in range(3):
            o1.votes.create(user=None, up=False)

        for _ in range(30):
            o2.votes.create(user=None, up=True)
        for _ in range(5):
            o2.votes.create(user=None, up=False)

        for _ in range(10):
            o3.votes.create(user=None, up=True)

        r = client.get(reverse_list(question_pk=q.pk))
        options = r.data["results"]
        assert len(options) == 3
        # Ordering based on rating
        assert options[0]["id"] == o2.pk
        assert options[1]["id"] == o3.pk
        assert options[2]["id"] == o1.pk
