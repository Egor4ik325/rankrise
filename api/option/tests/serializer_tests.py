import pytest
from django.db.utils import IntegrityError
from option.serializers import OptionSerializer


@pytest.mark.django_db
def test_data_is_valid(option_data):
    s = OptionSerializer(data=option_data)
    assert s.is_valid()
    s.save()


class TestFKFieldsValidation:
    @pytest.mark.django_db
    def test_question_fk_blank_validation(self, option_data):
        del option_data["question"]
        s = OptionSerializer(data=option_data)
        assert not s.is_valid()

    @pytest.mark.django_db
    def test_product_fk_blank_validation(self, option_data):
        del option_data["product"]
        s = OptionSerializer(data=option_data)
        assert not s.is_valid()

    @pytest.mark.django_db
    def test_question_fk_exists(self, max_question_id, option_data):
        option_data["question"] = max_question_id + 2
        s = OptionSerializer(data=option_data)
        assert not s.is_valid()

    @pytest.mark.django_db
    def test_product_fk_exists(self, max_product_id, option_data):
        option_data["product"] = max_product_id + 2
        s = OptionSerializer(data=option_data)
        assert not s.is_valid()

    @pytest.mark.django_db
    def test_question_product_are_unique_together(self, q, p, o, option_data):
        s = OptionSerializer(data=option_data)
        assert not s.is_valid()
