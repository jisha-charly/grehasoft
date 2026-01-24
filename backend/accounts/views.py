from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Department
from accounts.models import Role
from .models import TaskType
from .models import Client
from .models import Project,ProjectMilestone, ProjectMember
from .serializers import ClientSerializer
from .serializers import ProjectSerializer
from .serializers import ProjectMilestoneSerializer
from .serializers import ProjectMemberSerializer


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
        return Response({"error": "Role name is required"}, status=400)

    # 🔎 Check if role exists (even soft deleted)
    role = Role.objects.filter(name=name).first()

    if role:
        # ✅ Restore soft-deleted role
        if role.deleted_at:
            role.deleted_at = None
            role.description = description
            role.save()

            # 🔑 Reactivate users who previously had this role
            User.objects.filter(role__isnull=True).filter(
                username__in=User.objects.filter(role=None).values_list("username", flat=True)
            )

            User.objects.filter(role=None, is_active=False).update(
                role=role,
                is_active=True
            )

            return Response(
                {"message": "Role restored and users reactivated"},
                status=200
            )

        return Response({"error": "Role already exists"}, status=400)

    # ✅ Create brand new role
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

    # 🔑 Deactivate users with this role
    User.objects.filter(role=role).update(
        is_active=False,
        role=None
    )

    role.deleted_at = timezone.now()
    role.save()

    return Response(
        {"message": "Role deleted and users deactivated"},
        status=200
    )



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
# department
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_departments(request):
    departments = Department.objects.filter(deleted_at__isnull=True).select_related("parent")

    data = []
    for d in departments:
        data.append({
            "id": d.id,
            "name": d.name,
            "parent_id": d.parent.id if d.parent else None,
            "parent_name": d.parent.name if d.parent else None,
            "created_at": d.created_at,
        })

    return Response(data, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_department(request):
    name = request.data.get("name")
    parent_id = request.data.get("parent_id")

    if not name:
        return Response({"error": "Name is required"}, status=400)

    parent = None
    if parent_id:
        parent = get_object_or_404(
            Department, id=parent_id, deleted_at__isnull=True
        )

    Department.objects.create(
        name=name,
        parent=parent
    )

    return Response({"message": "Department created"}, status=201)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_department(request, dept_id):
    department = get_object_or_404(
        Department, id=dept_id, deleted_at__isnull=True
    )

    department.name = request.data.get("name", department.name)

    parent_id = request.data.get("parent_id")
    if parent_id:
        department.parent = get_object_or_404(
            Department, id=parent_id, deleted_at__isnull=True
        )
    else:
        department.parent = None

    department.save()
    return Response({"message": "Department updated"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_department(request, dept_id):
    department = get_object_or_404(
        Department, id=dept_id, deleted_at__isnull=True
    )

    # Optional safety: block delete if children exist
    if department.sub_departments.filter(deleted_at__isnull=True).exists():
        return Response(
            {"error": "Delete sub-departments first"},
            status=400
        )

    department.deleted_at = timezone.now()
    department.save()

    return Response({"message": "Department deleted"}, status=200)


# =================================================
# USER APIs (ADMIN ONLY)
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.filter(deleted_at__isnull=True).select_related("role", "department")

    data = []
    for u in users:
        data.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active,
            "role": u.role.name if u.role else None,
            "role_id": u.role.id if u.role else None,
            "department": u.department.name if u.department else None,
            "department_id": u.department.id if u.department else None,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        })

    return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    if request.user.role.name != "ADMIN":
        return Response({"error": "Forbidden"}, status=403)

    data = request.data

    user = User.objects.create_user(
        username=data["username"],
        email=data["email"],
        password=data["password"],
        role_id=data.get("role"),
        department_id=data.get("department"),
        is_active=True,
    )

    return Response({"message": "User created"})



@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    user = User.objects.get(id=user_id)

    user.email = request.data.get("email")
    user.role_id = request.data.get("role")
    user.department_id = request.data.get("department")
    user.is_active = request.data.get("is_active", True)

    user.save()
    return Response({"message": "User updated"})


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

# =================================================
# Tasktypes APIs (ADMIN ONLY)
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_task_types(request):
    task_types = TaskType.objects.filter(deleted_at__isnull=True)

    return Response([
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "created_at": t.created_at,
        }
        for t in task_types
    ])
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task_type(request):
    name = request.data.get("name")
    description = request.data.get("description", "")

    if not name:
        return Response({"error": "Name required"}, status=400)

    TaskType.objects.create(
        name=name,
        description=description
    )

    return Response({"message": "Task type created"})
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task_type(request, type_id):
    try:
        task_type = TaskType.objects.get(id=type_id)
        task_type.deleted_at = now()
        task_type.save()
        return Response({"message": "Deleted"})
    except TaskType.DoesNotExist:
        return Response({"error": "Not found"}, status=404)





@api_view(["PUT"])
def update_task_type(request, pk):
    try:
        task_type = TaskType.objects.get(pk=pk, deleted_at__isnull=True)
    except TaskType.DoesNotExist:
        return Response({"error": "Task type not found"}, status=404)

    task_type.name = request.data.get("name", task_type.name)
    task_type.description = request.data.get("description", task_type.description)
    task_type.save()

    return Response({"message": "Task type updated successfully"})
# =================================================
# Clients (JWT via /api/token/)
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_clients(request):
    clients = Client.objects.filter(deleted_at__isnull=True).order_by("-id")
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_client(request):
    serializer = ClientSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_client(request, id):
    try:
        client = Client.objects.get(id=id, deleted_at__isnull=True)
    except Client.DoesNotExist:
        return Response(
            {"detail": "Client not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ClientSerializer(client, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_client(request, id):
    try:
        client = Client.objects.get(id=id, deleted_at__isnull=True)
    except Client.DoesNotExist:
        return Response(
            {"detail": "Client not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    client.deleted_at = timezone.now()
    client.save()

    return Response(
        {"message": "Client deleted"},
        status=status.HTTP_204_NO_CONTENT
    )
# =================================================
# Project (JWT via /api/token/)
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_projects(request):
    projects = Project.objects.filter(deleted_at__isnull=True).order_by("-id")
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(
            created_by=request.user,
            status="not_started",
            progress_percentage=0,
        )
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_project(request, id):
    try:
        project = Project.objects.get(id=id, deleted_at__isnull=True)
    except Project.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    serializer = ProjectSerializer(project, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_project(request, id):
    project = Project.objects.get(id=id)
    project.deleted_at = timezone.now()
    project.save()
    return Response(status=204)

# =================================================
# Project milestones (JWT via /api/token/)
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_milestones(request, project_id):
    milestones = ProjectMilestone.objects.filter(
        project_id=project_id,
        deleted_at__isnull=True
    ).order_by("due_date")

    serializer = ProjectMilestoneSerializer(milestones, many=True)
    return Response(serializer.data)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_milestone(request, project_id):
    try:
        Project.objects.get(id=project_id, deleted_at__isnull=True)
    except Project.DoesNotExist:
        return Response(
            {"detail": "Project not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    data = request.data.copy()
    data["project"] = project_id

    serializer = ProjectMilestoneSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_milestone(request, id):
    try:
        milestone = ProjectMilestone.objects.get(
            id=id,
            deleted_at__isnull=True
        )
    except ProjectMilestone.DoesNotExist:
        return Response(
            {"detail": "Milestone not found"},
            status=404
        )

    serializer = ProjectMilestoneSerializer(
        milestone,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_milestone(request, id):
    try:
        milestone = ProjectMilestone.objects.get(id=id)
    except ProjectMilestone.DoesNotExist:
        return Response(
            {"detail": "Milestone not found"},
            status=404
        )

    milestone.deleted_at = timezone.now()
    milestone.save()

    return Response(status=204)
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def complete_milestone(request, id):
    try:
        milestone = ProjectMilestone.objects.get(
            id=id,
            deleted_at__isnull=True
        )
    except ProjectMilestone.DoesNotExist:
        return Response(
            {"detail": "Milestone not found"},
            status=404
        )

    milestone.status = "completed"
    milestone.save(update_fields=["status", "updated_at"])

    return Response(
        {"message": "Milestone marked as completed"}
    )
# =================================================
# Project members (JWT via /api/token/)
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_project_members(request, project_id):
    members = ProjectMember.objects.filter(
        project_id=project_id
    ).select_related("user")

    serializer = ProjectMemberSerializer(members, many=True)
    return Response(serializer.data)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_project_member(request, project_id):
    try:
        Project.objects.get(id=project_id, deleted_at__isnull=True)
    except Project.DoesNotExist:
        return Response(
            {"detail": "Project not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    data = request.data.copy()
    data["project"] = project_id

    serializer = ProjectMemberSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_project_member(request, id):
    try:
        member = ProjectMember.objects.get(id=id)
    except ProjectMember.DoesNotExist:
        return Response(
            {"detail": "Project member not found"},
            status=404
        )

    serializer = ProjectMemberSerializer(
        member,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_project_member(request, id):
    try:
        member = ProjectMember.objects.get(id=id)
    except ProjectMember.DoesNotExist:
        return Response(
            {"detail": "Project member not found"},
            status=404
        )

    member.delete()
    return Response(status=204)
