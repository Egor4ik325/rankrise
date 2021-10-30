import pytest
from django.db.utils import IntegrityError

from category.models import Category


@pytest.mark.django_db
class TestFields:
    def test_create(self, c):
        assert c.name == "Software Development"
        assert c.parent == None

    def test_name_unique(self, c):
        with pytest.raises(IntegrityError):
            Category.objects.create(name="Software Development", parent=c)

    def test_on_parent_delete(self, c, c2):
        c.delete()
        with pytest.raises(Category.DoesNotExist):
            Category.objects.get(pk=c2.pk)

    def test_ralated_manager(self, c, c2):
        assert c.children.count() == 1
        c.children.get(pk=c2.pk)


def test_ordering_by_name(c, c2, c3, c4):
    categories = Category.objects.all()
    assert len(categories) == 4
    assert categories[0].pk == c4.pk
    assert categories[1].pk == c2.pk
    assert categories[2].pk == c.pk
    assert categories[3].pk == c3.pk
