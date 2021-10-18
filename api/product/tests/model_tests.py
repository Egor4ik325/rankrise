import pytest
from django.core.files.uploadedfile import InMemoryUploadedFile, SimpleUploadedFile
from django.urls import reverse
from product.models import PriceChoices, Product, ProductImage


@pytest.fixture
def upload_test_image():
    """Create invalid in-memory image with image media type."""
    return SimpleUploadedFile(
        "image.png", b"some invalid image content", content_type="image/png"
    )


def load_upload_file():
    pass


def test_can_create_product_with_fields():
    p = Product.objects.create(
        name="Python",
        description="Modern programming language",
        website="https://python.org",
    )
    p = Product.objects.get(pk=p.pk)

    assert p.name == "Python"
    assert p.slug == "python"
    assert p.description == "Modern programming language"
    assert p.website == "https://python.org"
    assert p.price == PriceChoices.FREE


def test_can_create_product_with_images(upload_test_image):
    p = Product.objects.create(
        name="Python",
        description="Modern programming language",
        website="https://python.org",
        price=PriceChoices.OPEN_SOURCE,
    )
    p = Product.objects.get(pk=p.pk)
    i = ProductImage.objects.create(image=upload_test_file, product=p)
    i = ProductImage.objects.get(pk=i.pk)

    assert p.images.first().pk == i.pk


def test_get_alsolute_url():
    p = Product.objects.create(
        name="Python",
        description="Modern programming language",
        website="https://python.org",
    )
    assert p.get_absolute_url() == reverse("product-detail", kwargs={"slug": p.slug})
