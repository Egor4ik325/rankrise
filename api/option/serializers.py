from rest_framework import serializers

from option.models import Option


class OptionSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()
    downvotes = serializers.ReadOnlyField()

    class Meta:
        model = Option
        fields = "__all__"

        # TODO: question write only
