import pytest
from question.models import Question
from django.utils import timezone
from django.urls import reverse


@pytest.mark.django_db
def test_can_create_question():
    title = "What is the best game?"
    q = Question.objects.create(title=title)
    assert q.title == title
    assert q.ask_time < timezone.now()
    assert q.get_absolute_url() == reverse("question-detail", args=[q.pk])
