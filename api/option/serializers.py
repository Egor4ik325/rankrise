from rest_framework import serializers

from option.models import Option


class OptionSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()
    downvotes = serializers.ReadOnlyField()
    rank = serializers.IntegerField(read_only=True)

    class Meta:
        model = Option
        # TODO: instead of product primary key, serialize product slug (custom property, field or method)
        fields = "__all__"

        # TODO: question write only
