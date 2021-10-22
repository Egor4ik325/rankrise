import pytest
from option.serializers import OptionSerializer


def test_data_is_valid(option_data):
    s = OptionSerializer(option_data)
    assert s.is_valid()


class TestFKFieldsValidation:
    def test_question_fk_blank_validation(self, option_data):
        del option_data["question"]
        s = OptionSerializer(option_data)
        assert not s.is_valid()

    def test_product_fk_blank_validation(self, option_data):
        del option_data["product"]
        s = OptionSerializer(option_data)
        assert not s.is_valid()

    def test_question_fk_exists(self, max_question_id):
        option_data["question"] = max_question_id + 1
        s = OptionSerializer(option_data)
        assert not s.is_valid()

    def test_product_fk_exists(self, max_product_id):
        option_data["product"] = max_product_id + 1
        s = OptionSerializer(option_data)
        assert not s.is_valid()

    def test_question_product_are_unique_together(self, q, p, o, option_data):
        s = OptionSerializer(option_data)
        assert not s.is_valid()
