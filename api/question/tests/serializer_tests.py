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
