import csv
from product.models import Product, PriceChoices


with open("android-games.csv") as dataset:
    reader = csv.reader(dataset)

    # Skip header
    next(reader, None)

    for row in reader:
        name = row[1]
        paid = row[14] == "True"
        if paid:
            price = PriceChoices.PAID
        else:
            price = PriceChoices.FREE
        _, created = Product.objects.get_or_create(name=name, defaults={"price": price})
