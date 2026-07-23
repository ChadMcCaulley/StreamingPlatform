from django.contrib import admin
from .models import Title


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'year', 'match_score', 'featured', 'trending', 'new_release')
    list_filter = ('type', 'featured', 'trending', 'new_release')
    search_fields = ('title', 'slug', 'description')
    prepopulated_fields = {'slug': ('title',)}
