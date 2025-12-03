from django.contrib import admin
from .models import quest
# Register your models here.

admin.site.site_header = "Gemini Admin"
admin.site.site_title = "Gemini Admin Portal"
admin.site.register(quest)