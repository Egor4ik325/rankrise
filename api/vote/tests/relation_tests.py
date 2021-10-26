import pytest
from option.serializers import OptionSerializer


@pytest.mark.django_db
class TestOptionVoteRelation:
    @pytest.fixture
    def setup_votes(self, django_user_model, o):
        def _create_vote(username, up):
            user = django_user_model.objects.create_user(
                username=username, password="user"
            )
            return o.votes.create(user=user, up=up)

        v1 = _create_vote("user1", True)
        v2 = _create_vote("user2", True)
        v3 = _create_vote("user3", True)
        v4 = _create_vote("user4", False)
        yield

    class TestModel:
        def test_option_upvotes(self, o, setup_votes):
            assert o.upvotes == 3

        def test_option_downvotes(self, o, setup_votes):
            assert o.downvotes == 1

    class TestSerializer:
        def test_upvotes(self, o, setup_votes):
            s = OptionSerializer(instance=o)
            assert s.fields.get("upvotes") is not None
            assert s.data.get("upvotes") == 3

        def test_downvotes(self, o, setup_votes):
            s = OptionSerializer(instance=o)
            assert s.fields.get("downvotes") is not None
            assert s.data.get("downvotes") == 1

    class TestView:
        def test_upvotes(self, o, client, setup_votes):
            r = client.get(o.get_absolute_url())
            assert r.data.get("upvotes") == 3

        def test_downvotes(self, o, client, setup_votes):
            r = client.get(o.get_absolute_url())
            assert r.data.get("downvotes") == 1
