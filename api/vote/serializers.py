from authentication.models import UserModel
from option.models import Option
from rest_framework import serializers
from vote.models import Vote

serializers.CurrentUserDefault()


class VoteSerializer(serializers.ModelSerializer):
    # Override model fields (to add extra field arguments)
    option = serializers.PrimaryKeyRelatedField(
        queryset=Option.objects.all(), write_only=True, required=False
    )
    user = serializers.PrimaryKeyRelatedField(
        queryset=UserModel.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Vote
        fields = ["pk", "option", "user", "up", "experience", "vote_time"]
        # Remove UniqueTogether validator for option and user
        validators = []
        # TODO: option and user should be hidden and set by view or serializer
        # extra_kwargs = {
        #     "option": {"write_only": True, "required": False},
        #     "user": {"write_only": True, "required": False},
        # }

    def validate(self, data):
        """Dynamically validate option and user are unique together when not None."""
        option = data.get("option")
        user = data.get("user")
        if option is not None and user is not None:
            try:
                obj = Vote.objects.get(option=option, user=user)
            except Vote.DoesNotExist:
                return data
            if self.instance and self.instance.id == obj.id:
                return data

            raise serializers.ValidationError("Vote already exists")

        return data
