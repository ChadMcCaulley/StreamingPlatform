from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from catalog.models import Title
from catalog.serializers import TitleSerializer
from .models import ContinueWatching, MyListItem, Profile

AVATAR_COLORS = ['#5b5bf0', '#0d9488', '#7c3aed', '#0891b2', '#ca8a04', '#db2777', '#4f46e5']


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='pk', read_only=True)
    avatarColor = serializers.CharField(source='avatar_color')

    class Meta:
        model = Profile
        fields = ['id', 'name', 'avatarColor', 'kids']


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('An account with this email already exists')
        return email

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data['name'].strip()
        password = validated_data['password']
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name.split()[0] if name else '',
            last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
        )
        Profile.objects.create(
            user=user,
            name=name.split()[0] or 'Me',
            avatar_color=AVATAR_COLORS[0],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs['email'].strip().lower()
        # alias legacy demo email
        if email == 'demo@streamflix.app':
            email = 'demo@signal.app'
        user = authenticate(
            username=email,
            password=attrs['password'],
        )
        if not user:
            # try email lookup + auth
            try:
                u = User.objects.get(email__iexact=email)
                user = authenticate(username=u.username, password=attrs['password'])
            except User.DoesNotExist:
                user = None
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        attrs['user'] = user
        attrs['email'] = email
        return attrs


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='pk', read_only=True)
    name = serializers.SerializerMethodField()
    profiles = ProfileSerializer(many=True, read_only=True)
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'profiles', 'createdAt']

    def get_name(self, obj):
        full = f'{obj.first_name} {obj.last_name}'.strip()
        return full or obj.email.split('@')[0]


class ProfileCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=40)
    kids = serializers.BooleanField(default=False, required=False)

    def validate_name(self, value):
        name = value.strip()
        if not name:
            raise serializers.ValidationError('Profile name is required')
        user = self.context['request'].user
        if user.profiles.count() >= 5:
            raise serializers.ValidationError('Maximum of 5 profiles reached')
        if user.profiles.filter(name__iexact=name).exists():
            raise serializers.ValidationError('A profile with that name already exists')
        return name

    def create(self, validated_data):
        user = self.context['request'].user
        color = AVATAR_COLORS[user.profiles.count() % len(AVATAR_COLORS)]
        return Profile.objects.create(
            user=user,
            name=validated_data['name'],
            kids=validated_data.get('kids', False),
            avatar_color=color,
        )


class MyListItemSerializer(serializers.ModelSerializer):
    content = TitleSerializer(source='title', read_only=True)
    id = serializers.CharField(source='title.slug', read_only=True)

    class Meta:
        model = MyListItem
        fields = ['id', 'content', 'added_at']


class ContinueSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='title.slug', read_only=True)
    content = TitleSerializer(source='title', read_only=True)
    progress = serializers.FloatField()
    duration = serializers.FloatField()
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    pct = serializers.SerializerMethodField()

    class Meta:
        model = ContinueWatching
        fields = ['id', 'content', 'progress', 'duration', 'updatedAt', 'pct']

    def get_pct(self, obj):
        if not obj.duration:
            return 0
        return round((obj.progress / obj.duration) * 100)


class ContinueWriteSerializer(serializers.Serializer):
    titleId = serializers.SlugField()
    progress = serializers.FloatField(min_value=0)
    duration = serializers.FloatField(min_value=0)

    def validate_titleId(self, value):
        try:
            return Title.objects.get(slug=value)
        except Title.DoesNotExist:
            raise serializers.ValidationError('Title not found')
