from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from rest_framework.authtoken.models import Token

from accounts.models import Profile
from catalog.models import Title
from catalog.seed_data import TITLES


class Command(BaseCommand):
    help = 'Seed catalog titles and demo user (demo@signal.app / demo1234)'

    def handle(self, *args, **options):
        created = 0
        updated = 0
        for row in TITLES:
            defaults = {k: v for k, v in row.items() if k != 'slug'}
            # ensure booleans default
            defaults.setdefault('featured', False)
            defaults.setdefault('trending', False)
            defaults.setdefault('new_release', False)
            defaults.setdefault('cast', [])
            defaults.setdefault('genres', [])
            obj, was_created = Title.objects.update_or_create(
                slug=row['slug'],
                defaults=defaults,
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(f'Titles: {created} created, {updated} updated'))

        email = 'demo@signal.app'
        user, user_created = User.objects.get_or_create(
            username=email,
            defaults={
                'email': email,
                'first_name': 'Demo',
                'last_name': 'User',
            },
        )
        if user_created or not user.has_usable_password():
            user.set_password('demo1234')
            user.email = email
            user.save()
            self.stdout.write(self.style.SUCCESS('Demo user created/updated'))
        else:
            # keep password in sync for local demo convenience
            user.set_password('demo1234')
            user.save()
            self.stdout.write('Demo user password reset to demo1234')

        Token.objects.get_or_create(user=user)

        profiles = [
            ('Alex', '#5b5bf0', False),
            ('Jordan', '#0d9488', False),
            ('Kids', '#ca8a04', True),
        ]
        for name, color, kids in profiles:
            Profile.objects.get_or_create(
                user=user,
                name=name,
                defaults={'avatar_color': color, 'kids': kids},
            )

        self.stdout.write(self.style.SUCCESS('Seed complete. Login: demo@signal.app / demo1234'))
