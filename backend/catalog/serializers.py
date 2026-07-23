from rest_framework import serializers
from .models import Title


class TitleSerializer(serializers.ModelSerializer):
    """Shape matches the React Content type (camelCase)."""

    id = serializers.CharField(source='slug', read_only=True)
    matchScore = serializers.IntegerField(source='match_score', read_only=True)
    posterUrl = serializers.URLField(source='poster_url', read_only=True)
    backdropUrl = serializers.URLField(source='backdrop_url', read_only=True)
    trailerUrl = serializers.URLField(source='trailer_url', read_only=True)
    videoUrl = serializers.URLField(source='video_url', read_only=True)
    accentFrom = serializers.CharField(source='accent_from', read_only=True)
    accentTo = serializers.CharField(source='accent_to', read_only=True)
    newRelease = serializers.BooleanField(source='new_release', read_only=True)

    class Meta:
        model = Title
        fields = [
            'id',
            'title',
            'description',
            'type',
            'year',
            'rating',
            'duration',
            'genres',
            'matchScore',
            'posterUrl',
            'backdropUrl',
            'trailerUrl',
            'videoUrl',
            'accentFrom',
            'accentTo',
            'featured',
            'trending',
            'newRelease',
            'cast',
            'seasons',
        ]
