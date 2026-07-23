from django.contrib import admin
from .models import ContinueWatching, MyListItem, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'kids', 'avatar_color')
    list_filter = ('kids',)
    search_fields = ('name', 'user__email')


@admin.register(MyListItem)
class MyListItemAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title', 'added_at')


@admin.register(ContinueWatching)
class ContinueWatchingAdmin(admin.ModelAdmin):
    list_display = ('profile', 'title', 'progress', 'duration', 'updated_at')
