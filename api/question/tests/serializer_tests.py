import pytest
from django.utils import timezone
from question.models import Question
from question.serializers import QuestionSerializer


def test_can_create_question_title_less_than_100():
    serializer = QuestionSerializer(
        data={"title": "What is the best shortcut program?"}
    )
    assert serializer.is_valid()


def test_can_not_create_question_tilte_longer_than_100():
    serializer = QuestionSerializer(
        data={
            "title": "What is the best shortcut program? What is the best shortcut program? What is the best shortcut program? What is the best shortcut program?"
        }
    )
    assert not serializer.is_valid()


@pytest.mark.django_db
def test_cant_update_ask_time():
    question = Question(title="Most popular Python IDE?")
    new_title = "Updated question title?"
    new_time = timezone.now()
    serializer = QuestionSerializer(
        question, data={"title": new_title, "ask_time": new_time}, partial=True
    )
    serializer.is_valid()
    serializer.save()
    new_question = Question.objects.get(pk=question.pk)
    assert new_question.title == new_title
    assert new_question.ask_time == question.ask_time
