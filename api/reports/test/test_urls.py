import pytest
from django.urls import resolve, reverse


def test_reverse_report_list():
    assert reverse("report-list") == "/api/reports/"


def test_resolve_report_detail():
    assert (
        resolve("/api/reports/a8986797-5664-4093-8905-9b12c17bc96f/").view_name
        == "report-detail"
    )
