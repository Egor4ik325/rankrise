from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.fields import ReadOnlyField

from .models import Report

User = get_user_model()


class ReportDeserializer(serializers.ModelSerializer):
    """
    Deserializer from dict to report.
    """

    reporter = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # Problems:
    # 1. read-only field is not included in the validated_data
    # 2. hidden-field in not included in the output
    # 3. normal field can be directly written
    # Not working for both serialization/deserialization:
    # reporter = ReadOnlyField(default=CurrentUserDefault()) # default for non-direct writing
    # reporter = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    # reporter = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())
    # reporter = serializers.PrimaryKeyRelatedField(read_only=True, required=True, default=serializers.CurrentUserDefault())

    object_model = serializers.SlugRelatedField(
        source="content_type",
        slug_field="model",
        queryset=ContentType.objects.filter(
            model__in=["question", "product", "option", "comment"]
        ),  # validation (by filter/choices)
    )

    class Meta:
        model = Report
        fields = [
            "title",
            "description",
            "reporter",
            "object_model",
            "object_pk",
            "created",
        ]

    def to_internal_value(self, data):
        data["object_model"] = data[
            "object_model"
        ].lower()  # convert object model to lower
        return super().to_internal_value(data)


class ReportSerializer(ReportDeserializer):
    """
    Serializer from report object to dict.
    """

    reporter = ReadOnlyField(source="reporter.username")
