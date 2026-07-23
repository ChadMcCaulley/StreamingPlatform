from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Title
from .serializers import TitleSerializer


class TitleListView(generics.ListAPIView):
    """
    GET /api/catalog/
    Query: type=movie|series, q=search, genre=, featured=, trending=, new=
    """

    serializer_class = TitleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Title.objects.all()
        params = self.request.query_params

        content_type = params.get('type')
        if content_type in ('movie', 'series'):
            qs = qs.filter(type=content_type)

        q = (params.get('q') or '').strip()
        if q:
            # SQLite-friendly search across title, description, genres, cast
            matched_ids = []
            needle = q.lower()
            for item in qs:
                hay = ' '.join(
                    [
                        item.title,
                        item.description,
                        ' '.join(item.genres or []),
                        ' '.join(item.cast or []),
                    ]
                ).lower()
                if needle in hay:
                    matched_ids.append(item.pk)
            qs = Title.objects.filter(pk__in=matched_ids)

        genre = (params.get('genre') or '').strip()
        if genre:
            # JSON list contains genre string
            filtered = [
                t.pk
                for t in qs
                if any(g.lower() == genre.lower() for g in (t.genres or []))
            ]
            qs = Title.objects.filter(pk__in=filtered)

        if params.get('featured') in ('1', 'true', 'yes'):
            qs = qs.filter(featured=True)
        if params.get('trending') in ('1', 'true', 'yes'):
            qs = qs.filter(trending=True)
        if params.get('new') in ('1', 'true', 'yes'):
            qs = qs.filter(new_release=True)

        return qs.distinct()


class TitleDetailView(generics.RetrieveAPIView):
    """GET /api/catalog/<slug>/"""

    serializer_class = TitleSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Title.objects.all()


class CatalogHomeView(APIView):
    """
    GET /api/catalog/home/
    Returns featured pool, spotlights, signal pick, and collection rows.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        all_titles = list(Title.objects.all())
        ser = TitleSerializer(all_titles, many=True)
        data = ser.data

        featured = [t for t in data if t.get('featured')]
        if len(featured) < 2:
            rest = sorted(
                [t for t in data if t not in featured],
                key=lambda x: x['matchScore'],
                reverse=True,
            )
            featured = (featured + rest)[:4]
        else:
            featured = featured[:4]

        featured_ids = {t['id'] for t in featured}
        spotlights = [
            t
            for t in data
            if t['id'] not in featured_ids and (t.get('newRelease') or t.get('trending'))
        ][:2]
        if len(spotlights) < 2:
            spotlights = [t for t in data if t['id'] not in featured_ids][:2]

        signal_pick = next(
            (
                t
                for t in sorted(data, key=lambda x: x['matchScore'], reverse=True)
                if t['id'] not in featured_ids
            ),
            featured[0] if featured else None,
        )

        def by_genre(name):
            return [
                t
                for t in data
                if any(g.lower() == name.lower() for g in (t.get('genres') or []))
            ]

        row_defs = [
            ('trending-now', 'Trending Now', [t for t in data if t.get('trending')]),
            ('new-releases', 'New Releases', [t for t in data if t.get('newRelease')]),
            ('action', 'Action', by_genre('Action')),
            ('comedy', 'Comedy', by_genre('Comedy')),
            ('documentary', 'Documentary', by_genre('Documentary')),
            ('animation', 'Animation', by_genre('Animation')),
            ('thriller', 'Thriller', by_genre('Thriller')),
            ('sci-fi', 'Sci-Fi', by_genre('Sci-Fi')),
        ]
        rows = [
            {'id': rid, 'title': title, 'items': items}
            for rid, title, items in row_defs
            if items
        ]

        genres = sorted({g for t in data for g in (t.get('genres') or [])})

        return Response(
            {
                'all': data,
                'featuredPool': featured,
                'spotlights': spotlights,
                'signalPick': signal_pick,
                'rows': rows,
                'genres': genres,
                'count': len(data),
            }
        )
