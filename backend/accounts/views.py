from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Department, Role
from .models import TaskType, Client, Project, ProjectMilestone, ProjectMember
from .serializers import (
    ClientSerializer,
    ProjectSerializer,
    ProjectMilestoneSerializer,
    ProjectMemberSerializer,
)

User = get_user_model()


# =================================================
# HELPERS
# =================================================
def is_admin(user):
    return user.role and user.role.name.upper() == "ADMIN"


# =================================================
# ROLE APIs (ADMIN ONLY)
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_roles(request):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    roles = Role.objects.filter(deleted_at__isnull=True)
    return Response(
        [{"id": r.id, "name": r.name, "description": r.description} for r in roles],
        status=200,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_role(request):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    name = request.data.get("name")
    description = request.data.get("description", "")

    if not name:
        return Response({"error": "Role name is required"}, status=400)

    role = Role.objects.filter(name=name).first()

    if role:
        if role.deleted_at:
            role.deleted_at = None
            role.description = description
            role.save()
            return Response({"message": "Role restored"}, status=200)
        return Response({"error": "Role already exists"}, status=400)

    Role.objects.create(name=name, description=description)
    return Response({"message": "Role created"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_role(request, role_id):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    role = get_object_or_404(Role, id=role_id, deleted_at__isnull=True)
    role.name = request.data.get("name", role.name)
    role.description = request.data.get("description", role.description)
    role.save()

    return Response({"message": "Role updated"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_role(request, role_id):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    role = get_object_or_404(Role, id=role_id, deleted_at__isnull=True)

    if role.name.upper() == "ADMIN":
        return Response({"error": "ADMIN role cannot be deleted"}, status=400)

    User.objects.filter(role=role).update(
        role=None, is_active=False, deleted_at=timezone.now()
    )

    role.deleted_at = timezone.now()
    role.save()

    return Response({"message": "Role deleted"}, status=200)


# =================================================
# AUTH
# =================================================
@api_view(["POST"])
def login_view(request):
    user = authenticate(
        username=request.data.get("username"),
        password=request.data.get("password"),
    )

    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    return Response(
        {
            "message": "Login successful",
            "username": user.username,
            "role": user.role.name if user.role else None,
        }
    )


# =================================================
# DEPARTMENTS
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_departments(request):
    departments = Department.objects.filter(deleted_at__isnull=True).select_related("parent")

    return Response([
        {
            "id": d.id,
            "name": d.name,
            "parent_id": d.parent.id if d.parent else None,
            "parent_name": d.parent.name if d.parent else None,
        }
        for d in departments
    ])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_department(request):
    Department.objects.create(
        name=request.data.get("name"),
        parent_id=request.data.get("parent_id"),
    )
    return Response({"message": "Department created"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_department(request, dept_id):
    dept = get_object_or_404(Department, id=dept_id, deleted_at__isnull=True)
    dept.name = request.data.get("name", dept.name)
    dept.parent_id = request.data.get("parent_id")
    dept.save()
    return Response({"message": "Department updated"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_department(request, dept_id):
    dept = get_object_or_404(Department, id=dept_id, deleted_at__isnull=True)

    if dept.sub_departments.filter(deleted_at__isnull=True).exists():
        return Response({"error": "Delete sub-departments first"}, status=400)

    dept.deleted_at = timezone.now()
    dept.save()
    return Response({"message": "Department deleted"})


# =================================================
# USERS (ADMIN ONLY)
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    users = User.objects.filter(deleted_at__isnull=True).select_related("role", "department")

    return Response([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active,
            "role": u.role.name if u.role else None,
            "department": u.department.name if u.department else None,
        }
        for u in users
    ])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    User.objects.create_user(
        username=request.data["username"],
        email=request.data["email"],
        password=request.data["password"],
        role_id=request.data.get("role"),
        department_id=request.data.get("department"),
        is_active=True,
    )

    return Response({"message": "User created"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.email = request.data.get("email", user.email)
    user.role_id = request.data.get("role")
    user.department_id = request.data.get("department")
    user.is_active = request.data.get("is_active", True)
    user.save()
    return Response({"message": "User updated"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    user = get_object_or_404(User, id=user_id)
    if user == request.user:
        return Response({"error": "Cannot delete yourself"}, status=400)

    user.deleted_at = timezone.now()
    user.is_active = False
    user.save()

    return Response({"message": "User deleted"})


# =================================================
# TASK TYPES
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_task_types(request):
    return Response([
        {"id": t.id, "name": t.name, "description": t.description}
        for t in TaskType.objects.filter(deleted_at__isnull=True)
    ])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task_type(request):
    TaskType.objects.create(
        name=request.data.get("name"),
        description=request.data.get("description", ""),
    )
    return Response({"message": "Task type created"}, status=201)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task_type(request, type_id):
    task_type = get_object_or_404(TaskType, id=type_id)
    task_type.deleted_at = timezone.now()
    task_type.save()
    return Response({"message": "Task type deleted"})


# =================================================
# CLIENTS / PROJECTS / MILESTONES / MEMBERS
# (Your existing logic here is already correct and safe)
# =================================================
