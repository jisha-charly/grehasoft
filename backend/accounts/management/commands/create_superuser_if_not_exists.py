from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = "Create a superuser if it does not already exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        username = os.getenv("DJANGO_SUPERUSER_USERNAME")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL")

        if not username or not password:
            self.stdout.write("Superuser env vars not set. Skipping.")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write("Superuser already exists.")
            return

        User.objects.create_superuser(
            username=username,
            password=password,
            email=email,
        )

        self.stdout.write("Superuser created successfully.")
