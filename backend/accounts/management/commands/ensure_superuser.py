from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = "Create superuser if it does not exist"

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")

        if not username or not password:
            self.stdout.write("Superuser env vars not set")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write("Superuser already exists")
            return

        User.objects.create_superuser(
            username=username,
            password=password,
            email=email,
        )

        self.stdout.write("Superuser created successfully")
