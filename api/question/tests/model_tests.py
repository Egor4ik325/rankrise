from question.models import Question
from django.utils import timezone


def test_can_create_question():
    title = "What is the best game?"
    q = Question.objects.create({"title": title})
    assert q.tilte == title
    assert q.ask_time < timezone.now()
