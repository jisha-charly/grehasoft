import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Create superuser if it doesn't exist"

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not username or not password:
            self.stdout.write("Superuser env vars not set")
            return

        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write("Superuser already exists, permissions ensured")
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        self.stdout.write("Superuser created")
