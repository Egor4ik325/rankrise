import pytest
from django.contrib.contenttypes.models import ContentType
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from question.models import Question
from question.throttles import BurstCommunityRateThrottle
from reports.models import Report


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(django_user_model):
    return django_user_model.objects.create_user(
        username="user", email="user@email.com", password="user"
    )


@pytest.fixture
def test_admin(django_user_model):
    return django_user_model.objects.create_user(
        username="admin", email="admin@email.com", password="admin", is_staff=True
    )


@pytest.fixture
def create_api_client(api_client):
    def make_api_client(user):
        refresh = RefreshToken.for_user(user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        return api_client

    return make_api_client


@pytest.fixture
def anonymous_client(api_client):
    return api_client


@pytest.fixture
def user_client(create_api_client, test_user):
    return create_api_client(test_user)


@pytest.fixture
def admin_client(create_api_client, test_admin):
    return create_api_client(test_admin)


@pytest.fixture
def disable_burst_throttle(monkeypatch):
    def mock_allow_request(self, *args, **kwargs):
        return True

    # Patch burst throttle to always allow (disable burst throttle)
    monkeypatch.setattr(BurstCommunityRateThrottle, "allow_request", mock_allow_request)
    yield


@pytest.fixture
def rq(user_client):
    """Request instance fixture."""
    request = user_client.get("/mock-path")
    return request


# Factory, instance and data fixtures


@pytest.fixture
def user(test_user):
    return test_user


@pytest.fixture
def question():
    return Question.objects.create(title="Some test question?")


@pytest.fixture
def report_dict(user, question):
    """Report in dictionary view."""

    return {
        "title": "Test report title",
        "description": "Some description of the problem",
        "reporter": user.pk,
        "content_type": ContentType.objects.get_for_model(Question),
        "object_pk": question.pk,
    }


@pytest.fixture
def report(report_dict):

    rd = report_dict.copy()
    reporter_id = rd.pop("reporter")
    return Report(rd | {"reporter_id": reporter_id})


# def make_user():
#     def make(**kwargs):
#         return
