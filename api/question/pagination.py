from rest_framework import pagination


class QuestionPagination(pagination.PageNumberPagination):
    page_size = 30
