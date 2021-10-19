import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from product.models import PriceChoices, Product
from product.serializers import ProductSerializer, ProductImageSerializer


@pytest.fixture
def test_data():
    return {
        "name": "Heroku",
        "description": "Cloud PaaS",
        "website": "https://heroku.com",
        "price": PriceChoices.PAID,
    }


def load_upload_file():
    with open(Path(__file__) / "media/sheep.png") as i:
        return SimpleUploadedFile("sheep.png", i.read(), content_type="image/png")


def test_is_valid(test_data):
    serializer = ProductSerializer(data=test_data)
    assert serializer.is_valid()


def test_name_unique(test_data):
    serializer = ProductSerializer(data=test_data)
    serializer.is_valid()
    serializer.save()
    assert not serializer.is_valid(), "Should not be able to create same instance twice"


@pytest.mark.parametrize("price", PriceChoices.values)
def test_price_choices(test_data, price):
    test_data["price"] = price
    serializer = ProductSerializer(data=test_data)
    assert serializer.is_valid()


def test_price_choices_invalid(test_data):
    test_data["price"] = "INVALID_PRICE"
    serializer = ProductSerializer(data=test_data)
    assert not serializer.is_valid()


def test_website_url(test_data):
    test_data["website"] = "some invalid url"
    assert not ProductSerializer(data=test_data).is_valid()


def test_description_blank(test_data):
    del test_data["description"]
    assert ProductSerializer(data=test_data).is_valid()


def test_price_blank(test_data):
    del test_data["price"]
    assert ProductSerializer(data=test_data).is_valid()


def test_name_not_blank(test_dat):
    del test_data["name"]
    assert not ProductSerializer(data=test_data).is_valid()


def test_name_greater_50(test_data):
    test_data["name"] = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    assert not ProductSerializer(data=test_data).is_valid()


@pytest.mark.django_db
def test_name_not_editable(test_data):
    serializer = ProductSerializer(data=test_data)
    serializer.is_valid()
    product = serializer.save()
    test_data["name"] = "AWS"
    serializer = ProductSerializer(product, data=test_data)
    serializer.is_valid()
    product = serializer.save()
    assert product.name != "AWS"


@pytest.fixture
def text_file():
    return SimpleUploadedFile("test.txt", b"Some test text", content_type="text/plain")


def test_image_format(test_data, text_file):
    p = Product.objects.create(**test_data)
    i = ProductImageSerializer(data={"image": text_file, "product": p})
    assert not i.is_valid()
