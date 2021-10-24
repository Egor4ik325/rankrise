import pytest
from vote.serializers import VoteSerializer


@pytest.mark.django_db
class TestValidation:
    def test_valid(v_data):
        assert VoteSerializer(data=v_data).is_valid()

    def test_option_not_exists(self, v_data):
        v_data["option"] = -1
        assert not VoteSerializer(data=v_data).is_valid()

    def test_user_not_exists(self, v_data):
        v_data["user"] = -1
        assert not VoteSerializer(data=v_data).is_valid()

    def test_not_unique_together(self, v, v_data):
        assert not VoteSerializer(data=v_data).is_valid()


class TestSerialization:
    pass