from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.serializers import TitleSerializer
from .models import ContinueWatching, MyListItem, Profile
from .serializers import (
    ContinueSerializer,
    ContinueWriteSerializer,
    LoginSerializer,
    ProfileCreateSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UserSerializer,
)


def auth_payload(user, token, profile_id=None):
    return {
        'token': token.key,
        'user': UserSerializer(user).data,
        'session': {
            'userId': str(user.pk),
            'email': user.email,
            'name': UserSerializer(user).data['name'],
            'profileId': str(profile_id) if profile_id else None,
        },
    }


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(auth_payload(user, token), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response(auth_payload(user, token))


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'ok': True})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})


class ProfileListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profiles = request.user.profiles.all()
        return Response({'profiles': ProfileSerializer(profiles, many=True).data})

    def post(self, request):
        ser = ProfileCreateSerializer(data=request.data, context={'request': request})
        ser.is_valid(raise_exception=True)
        profile = ser.save()
        return Response(ProfileSerializer(profile).data, status=status.HTTP_201_CREATED)


class ProfileDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        profile = get_object_or_404(Profile, pk=pk, user=request.user)
        if request.user.profiles.count() <= 1:
            return Response(
                {'detail': 'You must keep at least one profile'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def get_profile_for_request(request):
    """Resolve active profile from X-Profile-Id header."""
    profile_id = request.headers.get('X-Profile-Id') or request.query_params.get('profileId')
    if not profile_id:
        return None, Response(
            {'detail': 'X-Profile-Id header is required'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        profile = Profile.objects.get(pk=profile_id, user=request.user)
    except (Profile.DoesNotExist, ValueError):
        return None, Response(
            {'detail': 'Profile not found'},
            status=status.HTTP_404_NOT_FOUND,
        )
    return profile, None


class MyListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, err = get_profile_for_request(request)
        if err:
            return err
        items = MyListItem.objects.filter(profile=profile).select_related('title')
        ids = [i.title.slug for i in items]
        content = TitleSerializer([i.title for i in items], many=True).data
        return Response({'ids': ids, 'items': content})

    def post(self, request):
        """Add title: { titleId }"""
        profile, err = get_profile_for_request(request)
        if err:
            return err
        slug = request.data.get('titleId')
        if not slug:
            return Response({'detail': 'titleId is required'}, status=status.HTTP_400_BAD_REQUEST)
        from catalog.models import Title

        title = get_object_or_404(Title, slug=slug)
        MyListItem.objects.get_or_create(profile=profile, title=title)
        return self.get(request)

    def delete(self, request):
        """Remove title: ?titleId= or body titleId"""
        profile, err = get_profile_for_request(request)
        if err:
            return err
        slug = request.data.get('titleId') or request.query_params.get('titleId')
        if not slug:
            return Response({'detail': 'titleId is required'}, status=status.HTTP_400_BAD_REQUEST)
        MyListItem.objects.filter(profile=profile, title__slug=slug).delete()
        return self.get(request)


class MyListToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile, err = get_profile_for_request(request)
        if err:
            return err
        slug = request.data.get('titleId')
        if not slug:
            return Response({'detail': 'titleId is required'}, status=status.HTTP_400_BAD_REQUEST)
        from catalog.models import Title

        title = get_object_or_404(Title, slug=slug)
        existing = MyListItem.objects.filter(profile=profile, title=title).first()
        if existing:
            existing.delete()
            in_list = False
        else:
            MyListItem.objects.create(profile=profile, title=title)
            in_list = True
        items = MyListItem.objects.filter(profile=profile).select_related('title')
        ids = [i.title.slug for i in items]
        return Response({'ids': ids, 'inList': in_list})


class ContinueListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, err = get_profile_for_request(request)
        if err:
            return err
        qs = ContinueWatching.objects.filter(profile=profile).select_related('title')[:8]
        return Response({'items': ContinueSerializer(qs, many=True).data})

    def put(self, request):
        """Upsert progress."""
        profile, err = get_profile_for_request(request)
        if err:
            return err
        ser = ContinueWriteSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        title = ser.validated_data['titleId']
        progress = ser.validated_data['progress']
        duration = ser.validated_data['duration']

        if duration <= 0 or progress < 3:
            return Response({'ok': True, 'skipped': True})

        # Completed — remove
        if progress / duration > 0.92:
            ContinueWatching.objects.filter(profile=profile, title=title).delete()
            qs = ContinueWatching.objects.filter(profile=profile).select_related('title')[:8]
            return Response({'items': ContinueSerializer(qs, many=True).data, 'removed': True})

        obj, _ = ContinueWatching.objects.update_or_create(
            profile=profile,
            title=title,
            defaults={'progress': progress, 'duration': duration},
        )
        # Keep only 8 most recent
        stale = ContinueWatching.objects.filter(profile=profile).order_by('-updated_at')[8:]
        ContinueWatching.objects.filter(pk__in=[s.pk for s in stale]).delete()

        qs = ContinueWatching.objects.filter(profile=profile).select_related('title')[:8]
        return Response({'items': ContinueSerializer(qs, many=True).data})

    def delete(self, request):
        profile, err = get_profile_for_request(request)
        if err:
            return err
        slug = request.data.get('titleId') or request.query_params.get('titleId')
        if slug:
            ContinueWatching.objects.filter(profile=profile, title__slug=slug).delete()
        else:
            ContinueWatching.objects.filter(profile=profile).delete()
        qs = ContinueWatching.objects.filter(profile=profile).select_related('title')[:8]
        return Response({'items': ContinueSerializer(qs, many=True).data})
