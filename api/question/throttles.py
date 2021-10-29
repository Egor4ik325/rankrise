from rest_framework import throttling


class CommunityRateThrottle(throttling.SimpleRateThrottle):
    """
    Limit request (create request) rate of authenticated user.
    """

    def get_cache_key(self, request, view):
        if not request.user.is_authenticated:
            return None  # Only throttle autheticated users

        if request.user.is_staff:
            return None  # Only throttle standard users

        return self.cache_format % {
            "scope": self.scope,
            "ident": request.user.pk,  # user id as throttle identificator
        }

    def allow_request(self, request, view):
        # Always allow all actions except create
        if view.action != "create":
            return True

        return super().allow_request(request, view)


class BurstCommunityRateThrottle(CommunityRateThrottle):
    scope = "burst"


class SustainedCommunityRateThrottle(CommunityRateThrottle):
    scope = "sustained"
