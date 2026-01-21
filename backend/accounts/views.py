from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Role

User = get_user_model()

# =================================================
# ROLE APIs (ADMIN ONLY)
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_roles(request):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    roles = Role.objects.filter(deleted_at__isnull=True)
    return Response(
        [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
            }
            for r in roles
        ],
        status=200,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_role(request):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    name = request.data.get("name")
    description = request.data.get("description", "")

    if not name:
        return Response({"error": "Role name required"}, status=400)

    # Check if soft-deleted role exists
    role = Role.objects.filter(name=name).first()

    if role:
        if role.deleted_at:
            role.deleted_at = None
            role.description = description
            role.save()
            return Response({"message": "Role restored successfully"}, status=200)

        return Response({"error": "Role already exists"}, status=400)

    Role.objects.create(name=name, description=description)
    return Response({"message": "Role created successfully"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_role(request, role_id):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    role = get_object_or_404(Role, id=role_id, deleted_at__isnull=True)

    role.name = request.data.get("name", role.name)
    role.description = request.data.get("description", role.description)
    role.save()

    return Response({"message": "Role updated successfully"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_role(request, role_id):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    role = get_object_or_404(Role, id=role_id, deleted_at__isnull=True)

    if role.name == "ADMIN":
        return Response({"error": "ADMIN role cannot be deleted"}, status=400)

    role.deleted_at = timezone.now()
    role.save()

    return Response({"message": "Role deleted successfully"}, status=200)


# =================================================
# LOGIN (JWT via /api/token/)
# =================================================

@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return Response(
        {
            "message": "Login successful",
            "username": user.username,
            "role": user.role.name if user.role else None,
        },
        status=200,
    )


# =================================================
# USER APIs (ADMIN ONLY)
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Only admin can view users"}, status=403)

    users = User.objects.select_related("role").all()

    return Response(
    [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role.name if u.role else None,
            "role_id": u.role.id if u.role else None,  # ✅ ADD THIS
            "is_active": u.is_active,
        }
        for u in users
    ],
    status=200
)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Only admin can create users"}, status=403)

    data = request.data

    if User.objects.filter(username=data["username"]).exists():
        return Response({"error": "Username already exists"}, status=400)

    role = Role.objects.filter(
        id=data["role"],
        deleted_at__isnull=True
    ).first()

    if not role:
        return Response({"error": "Invalid role"}, status=400)

    user = User.objects.create_user(
        username=data["username"],
        email=data.get("email", ""),
        password=data["password"],
        role=role,
        is_staff=role.name == "ADMIN",
    )

    return Response({"message": "User created successfully"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Only admin can update users"}, status=403)

    user = get_object_or_404(User, id=user_id)
    data = request.data

    if "role" in data:
        role = get_object_or_404(Role, id=data["role"], deleted_at__isnull=True)
        user.role = role
        user.is_staff = role.name in ["ADMIN", "SOFTWARE_PM", "DM_PM"]

    user.email = data.get("email", user.email)
    user.is_active = data.get("is_active", user.is_active)
    user.save()

    return Response({"message": "User updated successfully"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not request.user.role or request.user.role.name != "ADMIN":
        return Response({"error": "Only admin can delete users"}, status=403)

    user = get_object_or_404(User, id=user_id)

    if user.id == request.user.id:
        return Response({"error": "Admin cannot delete own account"}, status=400)

    user.delete()
    return Response({"message": "User deleted successfully"}, status=200)
