import pytest
from django.utils import timezone

from vote.models import Vote


@pytest.mark.django_db
class TestFiedls:
    def test_create(self, o, u, v):
        v = Vote.objects.get(pk=v.pk)
        assert v.option.pk == o.pk
        assert v.user.pk == u.pk
        assert v.up == True
        assert v.vote_time < timezone.now()

    class TestOnDelete:
        def test_option_cascade(self, o, v):
            o.delete()
            with pytest.raises(Vote.DoesNotExist):
                Vote.objects.get(pk=v.pk)

        def test_user_set_null(self, u, v):
            u.delete()
            v = Vote.objects.get(pk=v.pk)
            assert v.user == None

    class TestRelatedManagers:
        def test_option(self, o, v):
            assert o.votes.count() == 1
            o.votes.get(pk=v.pk)

        def test_user(self, u, v):
            assert u.votes.count() == 1
            u.votes.get(pk=v.pk)


@pytest.mark.django_db
def test_absolute_name(v, detail_url):
    assert v.get_absolute_url() == detail_url


def test_ordering():
    pass
