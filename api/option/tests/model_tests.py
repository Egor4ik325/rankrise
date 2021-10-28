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
    @pytest.fixture
    def o1(self, q):
        p1 = Product.objects.create(name="Product1")
        return Option.objects.create(question=q, product=p1)

    @pytest.fixture
    def o2(self, q):
        p2 = Product.objects.create(name="Product2")
        return Option.objects.create(question=q, product=p2)

    @pytest.fixture
    def o3(self, q):
        p3 = Product.objects.create(name="Product3")
        return Option.objects.create(question=q, product=p3)

    @pytest.fixture
    def upvote(self):
        return lambda o, n: [o.votes.create(user=None, up=True) for _ in range(n)]

    @pytest.fixture
    def downvote(self):
        return lambda o, n: [o.votes.create(user=None, up=False) for _ in range(n)]

    class TestOrdering:
        def test_ordering_rating(
            self, q, o1, o2, o3, client, reverse_list, upvote, downvote
        ):
            upvote(o1, 12)
            downvote(o1, 3)
            upvote(o2, 30)
            downvote(o2, 5)
            upvote(o3, 10)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 3
            # Ordering based on rating
            assert options[0]["id"] == o2.pk
            assert options[1]["id"] == o3.pk
            assert options[2]["id"] == o1.pk

        def test_ordering_no_votes(self, q, o1, o2, o3, client, reverse_list):
            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 3
            # Ordering based on rating
            assert options[0]["id"] == o1.pk
            assert options[1]["id"] == o2.pk
            assert options[2]["id"] == o3.pk

        def test_1_without_votes(self, q, o1, o2, o3, client, reverse_list, upvote, downvote):
            upvote(o1, 12)
            downvote(o1, 3)
            upvote(o3, 10)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 3
            # Ordering based on rating
            assert options[0]["id"] == o3.pk
            assert options[1]["id"] == o1.pk
            assert options[2]["id"] == o2.pk

    class TestRank:
        def test_vote(self, q, o1, client, reverse_list, upvote, downvote):
            upvote(o1, 12)
            downvote(o1, 3)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 1
            assert options[0]["id"] == o1.id
            assert options[0]["rank"] == int(100 - 30 / 12)

        def test_novote(self, q, o1, client, reverse_list):
            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 1
            assert options[0]["id"] == o1.id
            assert options[0]["rank"] == 0

        def test_votes(self, q, o1, o2, client, reverse_list, upvote, downvote):
            upvote(o1, 12)
            downvote(o1, 3)
            upvote(o2, 30)
            downvote(o2, 5)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 2
            assert options[0]["id"] == o2.id
            assert options[1]["id"] == o1.id

            # Test rank
            assert options[0]["rank"] == 98
            assert options[1]["rank"] == 34

        def test_all_novotes(self, q, o1, o2, client, reverse_list):
            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 2
            assert options[0]["id"] == o1.id
            assert options[1]["id"] == o2.id

            # Test rank
            assert options[0]["rank"] == 0
            assert options[1]["rank"] == 0

        def test_1_novotes(self, q, o1, o2, client, reverse_list, upvote, downvote):
            upvote(o1, 12)
            downvote(o1, 3)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 2
            assert options[0]["id"] == o1.id
            assert options[1]["id"] == o2.id

            # Test rank
            assert options[0]["rank"] == 97
            assert options[1]["rank"] == 0

        def test_0_upvotes(self, q, o1, client, reverse_list, downvote):
            downvote(o1, 3)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 1
            assert options[0]["id"] == o1.id
            assert options[0]["rank"] == 0

        def test_all_downvotes(self, q, o1, o2, client, reverse_list):
            for _ in range(5):
                o1.votes.create(user=None, up=False)
            for _ in range(15):
                o2.votes.create(user=None, up=False)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 2
            assert options[0]["id"] == o1.id
            assert options[1]["id"] == o2.id

            # Test rank
            assert options[0]["rank"] == 0
            assert options[1]["rank"] == 0

        def test_equal_votes(self, q, o1, o2, client, reverse_list, upvote, downvote):
            upvote(o1, 30)
            downvote(o1, 5)
            upvote(o2, 30)
            downvote(o2, 5)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 2
            assert options[0]["id"] == o1.id
            assert options[1]["id"] == o2.id

            # Test rank
            assert options[0]["rank"] == 98
            assert options[1]["rank"] == 98

        def test_not_negative_rank(self, q, o1, client, reverse_list, downvote):
            downvote(o1, 30)

            r = client.get(reverse_list(question_pk=q.pk))
            options = r.data["results"]
            assert len(options) == 1
            assert options[0]["id"] == o1.id
            assert options[0]["rank"] == 0
