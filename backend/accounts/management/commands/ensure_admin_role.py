from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role

class Command(BaseCommand):
    help = "Ensure ADMIN role exists and assign to superuser"

    def handle(self, *args, **options):
        User = get_user_model()

        admin_role, _ = Role.objects.get_or_create(name="ADMIN")

        admin_user = User.objects.filter(is_superuser=True).first()

        if admin_user and admin_user.role != admin_role:
            admin_user.role = admin_role
            admin_user.save()

        self.stdout.write(self.style.SUCCESS("ADMIN role ensured"))
