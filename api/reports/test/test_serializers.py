import pytest
from reports.serializers import ReportDeserializer, ReportSerializer
from rest_framework import serializers

pytestmark = pytest.mark.django_db


def test_report_deserializer(question, user, report_dict, rq):
    # Serializer report data:
    # reporter, created should be set automatically
    data = {
        "title": report_dict["title"],
        "description": report_dict["description"],
        "object_model": report_dict["content_type"].model,
        "object_pk": report_dict["object_pk"],
    }
    rq.user = user

    serializer = ReportDeserializer(data=data, context={"request": rq})
    assert serializer.is_valid()

    report = serializer.save()
    assert report.object == question
    assert report.created is not None
    assert report.reporter == user


def test_report_serializer(report):
    serializer = ReportSerializer(report)
    assert set(serializer.data.keys()) == {
        "title",
        "description",
        "reporter",
        "object_model",
        "object_pk",
        "created",
    }


def test_reporter_can_not_be_changed_by_body(question, user, report_dict, rq):
    data = {
        "title": report_dict["title"],
        "description": report_dict["description"],
        "object_model": report_dict["content_type"].model,
        "object_pk": report_dict["object_pk"],
        # Direct writing to hidden field
        "reporter": 123,
    }
    rq.user = user

    serializer = ReportDeserializer(data=data, context={"request": rq})
    assert serializer.is_valid()
    report = serializer.save()
    assert report.reporter == user


def test_not_supported_model(question, user, report_dict, rq):
    data = {
        "title": report_dict["title"],
        "description": report_dict["description"],
        "object_model": "somemodel",
        "object_pk": report_dict["object_pk"],
    }
    rq.user = user

    serializer = ReportDeserializer(data=data, context={"request": rq})
    assert not serializer.is_valid()


def test_convert_to_lower(question, user, report_dict, rq):
    data = {
        "title": report_dict["title"],
        "description": report_dict["description"],
        "object_model": "QuEsTioN",
        "object_pk": report_dict["object_pk"],
    }
    rq.user = user

    serializer = ReportDeserializer(data=data, context={"request": rq})
    assert serializer.is_valid()
    report = serializer.save()
    assert report.content_type.model == "question"

