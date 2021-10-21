from rest_framework import serializers

from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["pk", "title", "ask_time"]
        read_only_fields = ["ask_time"]
