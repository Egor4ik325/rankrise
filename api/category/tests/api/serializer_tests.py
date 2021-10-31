"""
Test serializer class:

- field kwargs
- input data validation
- converting model instance into Python dict (for JSON rendering)
"""
import pytest
from category.serializers import CategorySerializer


class TestFields:
    class TestReadOnly:
        def test_name(self):
            pass

4
class NotTestIsValid:
    """
    Test model/serializer validation is working.

    NO VALIDATION is required because all serializer field are read-only and API is read-only.
    """

    def test_create_is_valid(self, category_data):
        """Test that serializer fields clone model fields.
        And is working with valid test data."""
        assert CategorySerializer(data=category_data).is_valid()

    def test_update_is_valid(self, c4, update_category_data):
        assert CategorySerializer(instance=c4, data=update_category_data).is_valid()

    def test_name_longer_50(self, category_data):
        assert not CategorySerializer(
            data={
                **category_data,
                "name": "Very long name with more than 50 characters long, or something around that",
            }
        ).is_valid()

    def test_name_contain_number(self, category_data):
        assert not CategorySerializer(
            data={**category_data, "name": "This name is invalid with 32 number"}
        ).is_valid()

    def test_parent_not_exists(self, category_data):
        assert not CategorySerializer(data={**category_data, "parent": -1}).is_valid()

    def test_parent_is_self(self, c4, category_data):
        # Try to update instance with parent to inself
        return not CategorySerializer(
            instance=c4, data={**category_data, "parent": c4.pk}
        ).is_valid()


@pytest.mark.django_db
class TestSerializedData:
    """Test model fields that are in the rendered data."""

    def test(self, c4):
        """Test serialization result is valid."""
        s = CategorySerializer(instance=c4)
        assert s.data["pk"] == c4.pk
        assert s.data["name"] == c4.name
        # assert s.data["parent"] == c4.parent.pk
