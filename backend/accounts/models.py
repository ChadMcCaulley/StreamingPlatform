from django.conf import settings
from django.db import models

from catalog.models import Title


class Profile(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profiles',
    )
    name = models.CharField(max_length=40)
    avatar_color = models.CharField(max_length=16, default='#5b5bf0')
    kids = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        unique_together = [('user', 'name')]

    def __str__(self):
        return f'{self.name} ({self.user.email})'


class MyListItem(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='list_items')
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name='listed_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('profile', 'title')]
        ordering = ['-added_at']

    def __str__(self):
        return f'{self.profile.name} → {self.title.slug}'


class ContinueWatching(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='continue_items')
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name='continue_by')
    progress = models.FloatField(default=0)
    duration = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [('profile', 'title')]
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.profile.name} @ {self.title.slug}'
