from django.contrib import admin

from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    date_hierarchy = "ask_time"
    search_fields = ["title"]
    ordering = ["ask_time"]


admin.site.register(Question, QuestionAdmin)
