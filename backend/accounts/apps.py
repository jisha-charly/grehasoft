from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        from django.contrib.auth import get_user_model
        from django.db.utils import OperationalError
        from .models import Role

        User = get_user_model()

        try:
            # Ensure ADMIN role exists
            admin_role, _ = Role.objects.get_or_create(name="ADMIN")

            # Assign ADMIN role to first superuser
            admin_user = User.objects.filter(is_superuser=True).first()

            if admin_user and admin_user.role != admin_role:
                admin_user.role = admin_role
                admin_user.save()

        except OperationalError:
            # DB not ready during migration/startup
            pass
