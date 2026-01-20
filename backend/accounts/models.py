from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("SOFTWARE_PM", "Software Project Manager"),
        ("DM_PM", "Digital Marketing Project Manager"),
        ("SOFTWARE_EMP", "Software Employee"),
        ("DM_EMP", "Digital Marketing Employee"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="SOFTWARE_EMP"
    )
