from django.db import models


class Title(models.Model):
    class ContentType(models.TextChoices):
        MOVIE = 'movie', 'Movie'
        SERIES = 'series', 'Series'

    slug = models.SlugField(unique=True, max_length=80)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=16, choices=ContentType.choices, default=ContentType.MOVIE)
    year = models.PositiveIntegerField()
    rating = models.CharField(max_length=32, blank=True)
    duration = models.CharField(max_length=32, blank=True)
    match_score = models.PositiveSmallIntegerField(default=80)
    poster_url = models.URLField(max_length=500, blank=True)
    backdrop_url = models.URLField(max_length=500, blank=True)
    trailer_url = models.URLField(max_length=500, blank=True)
    video_url = models.URLField(max_length=500, blank=True)
    accent_from = models.CharField(max_length=16, default='#333333')
    accent_to = models.CharField(max_length=16, default='#666666')
    featured = models.BooleanField(default=False)
    trending = models.BooleanField(default=False)
    new_release = models.BooleanField(default=False)
    cast = models.JSONField(default=list, blank=True)
    genres = models.JSONField(default=list, blank=True)
    seasons = models.PositiveSmallIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-match_score', 'title']

    def __str__(self):
        return self.title
