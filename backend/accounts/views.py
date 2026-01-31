from django.db import IntegrityError
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Department, Role
from .models import TaskType, Client, Project, ProjectMilestone, ProjectMember,Task,TaskAssignment,TaskProgress
from .serializers import (
    ClientSerializer,
    ProjectSerializer,
    ProjectMilestoneSerializer,
    ProjectMemberSerializer,
    DepartmentSerializer,TaskSerializer,TaskAssignmentSerializer,TaskCreateUpdateSerializer,TaskProgressSerializer
)
from django.contrib.auth import get_user_model

from django.contrib.auth.password_validation import validate_password
from .serializers import ProfileUpdateSerializer, ChangePasswordSerializer,UserSerializer
User = get_user_model()


# =================================================
# login HELPERS
# =================================================
def is_admin(user):
    return (
        user.is_authenticated
        and hasattr(user, "role")
        and user.role
        and user.role.name.upper() == "ADMIN"
    )


# ==========================
# UPDATE PROFILE
# ==========================
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data.copy()

    # Clean empty fields
    if data.get("email") == "":
        data.pop("email")

    try:
        serializer = ProfileUpdateSerializer(
            user, data=data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully"},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except IntegrityError:
        return Response(
            {"error": "Username or email already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        # last safety net – NEVER expose 500
        return Response(
            {"error": "Profile update failed"},
            status=status.HTTP_400_BAD_REQUEST,
        )



# ==========================
# CHANGE PASSWORD
# ==========================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    old_password = serializer.validated_data["old_password"]
    new_password = serializer.validated_data["new_password"]

    if not user.check_password(old_password):
        return Response(
            {"error": "Old password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_password(new_password, user)
    except Exception as e:
        return Response(
            {"error": list(e.messages)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password changed successfully"},
        status=status.HTTP_200_OK,
    )


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

    Role.objects.create(
        name=name,
        description=description
    )

    return Response({"message": "Role created"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_role(request, role_id):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    role = get_object_or_404(
        Role,
        id=role_id,
        deleted_at__isnull=True
    )

    role.name = request.data.get("name", role.name)
    role.description = request.data.get("description", role.description)
    role.save()

    return Response({"message": "Role updated"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_role(request, role_id):
    if not is_admin(request.user):
        return Response({"error": "Forbidden"}, status=403)

    role = get_object_or_404(
        Role,
        id=role_id,
        deleted_at__isnull=True
    )

    if role.name.upper() == "ADMIN":
        return Response(
            {"error": "ADMIN role cannot be deleted"},
            status=400
        )

    User.objects.filter(role=role).update(
        role=None,
        is_active=False,
        deleted_at=timezone.now()
    )

    role.deleted_at = timezone.now()
    role.save()

    return Response({"message": "Role deleted"}, status=200)




# =================================================
# DEPARTMENTS
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_departments(request):
    departments = Department.objects.filter(deleted_at__isnull=True)
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

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
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def users_list_create(request):
    # ================= LIST USERS =================
    if request.method == "GET":
        users = User.objects.filter(deleted_at__isnull=True).select_related(
            "role", "department"
        )
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    # ================= CREATE USER =================
    if request.method == "POST":
        # 🔐 Admin check (SAFE)
        if not request.user.is_authenticated or not is_admin(request.user):
            return Response({"error": "Forbidden"}, status=403)

        # 📥 Safe data access
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")
        department = request.data.get("department")

        # ❗ Required fields
        if not username or not email or not password:
            return Response(
                {"error": "Username, email and password are required"},
                status=400
            )

        # ❗ Duplicate checks
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=400
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=400
            )

        # ✅ Create user
        User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role_id=role,
            department_id=department,
            is_active=True,
        )

        return Response({"message": "User created"}, status=201)



@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def user_update_delete(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # UPDATE
    if request.method == "PUT":
        user.email = request.data.get("email", user.email)
        user.role_id = request.data.get("role")
        user.department_id = request.data.get("department")
        user.is_active = request.data.get("is_active", True)
        user.save()
        return Response({"message": "User updated"})

    # DELETE
    if request.method == "DELETE":
        if not is_admin(request.user):
            return Response({"error": "Forbidden"}, status=403)

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

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task_type(request, pk):
    try:
        task_type = TaskType.objects.get(pk=pk, deleted_at__isnull=True)
    except TaskType.DoesNotExist:
        return Response(
            {"error": "Task type not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    task_type.name = request.data.get("name", task_type.name)
    task_type.description = request.data.get("description", task_type.description)
    task_type.updated_at = timezone.now()
    task_type.save()

    return Response(
        {"message": "Task type updated successfully"},
        status=status.HTTP_200_OK
    )


# =================================================
# CLIENTS / PROJECTS / MILESTONES / MEMBERS
# (Your existing logic here is already correct and safe)
# =================================================
# =================================================
# CLIENTS
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_clients(request):
    clients = Client.objects.filter(deleted_at__isnull=True).order_by("-id")
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_client(request):
    serializer = ClientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_client(request, id):
    client = get_object_or_404(Client, id=id, deleted_at__isnull=True)
    serializer = ClientSerializer(client, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_client(request, id):
    client = get_object_or_404(Client, id=id, deleted_at__isnull=True)
    client.deleted_at = timezone.now()
    client.save()
    return Response({"message": "Client deleted"}, status=204)


# =================================================
# PROJECTS
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_projects(request):
    projects = Project.objects.filter(deleted_at__isnull=True).order_by("-id")
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_project(request, id):
    project = get_object_or_404(Project, id=id, deleted_at__isnull=True)
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=200)


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
    project = get_object_or_404(Project, id=id, deleted_at__isnull=True)
    serializer = ProjectSerializer(project, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_project(request, id):
    project = get_object_or_404(Project, id=id, deleted_at__isnull=True)
    project.deleted_at = timezone.now()
    project.save()
    return Response(status=204)


# =================================================
# PROJECT MILESTONES
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_milestones(request, project_id):
    milestones = ProjectMilestone.objects.filter(
        project_id=project_id,
        deleted_at__isnull=True
    ).order_by("due_date")
    serializer = ProjectMilestoneSerializer(milestones, many=True)
    return Response(serializer.data, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_milestone(request, project_id):
    get_object_or_404(Project, id=project_id, deleted_at__isnull=True)

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
    milestone = get_object_or_404(
        ProjectMilestone, id=id, deleted_at__isnull=True
    )
    serializer = ProjectMilestoneSerializer(
        milestone, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def complete_milestone(request, id):
    milestone = get_object_or_404(
        ProjectMilestone, id=id, deleted_at__isnull=True
    )
    milestone.status = "completed"
    milestone.save(update_fields=["status", "updated_at"])
    return Response({"message": "Milestone completed"}, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_milestone(request, id):
    milestone = get_object_or_404(ProjectMilestone, id=id)
    milestone.deleted_at = timezone.now()
    milestone.save()
    return Response(status=204)


# =================================================
# PROJECT MEMBERS
# =================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_project_members(request, project_id):
    members = ProjectMember.objects.filter(
        project_id=project_id,
        deleted_at__isnull=True
    ).select_related("user")
    serializer = ProjectMemberSerializer(members, many=True)
    return Response(serializer.data, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_project_member(request, project_id):
    get_object_or_404(Project, id=project_id, deleted_at__isnull=True)

    data = request.data.copy()
    data["project"] = project_id

    serializer = ProjectMemberSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_project_member(request, id):
    member = get_object_or_404(
        ProjectMember, id=id, deleted_at__isnull=True
    )
    serializer = ProjectMemberSerializer(
        member, data=request.data, partial=True
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_project_member(request, id):
    member = get_object_or_404(
        ProjectMember, id=id, deleted_at__isnull=True
    )
    member.deleted_at = timezone.now()
    member.save()
    return Response(status=204)

# =================================================
# Task Management
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_tasks_by_project(request, project_id):
    tasks = Task.objects.filter(
        project_id=project_id,
        deleted_at__isnull=True
    ).order_by("board_order")

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    serializer = TaskCreateUpdateSerializer(data=request.data)
    if serializer.is_valid():
        task = serializer.save(created_by=request.user)
        return Response(TaskSerializer(task).data, status=201)

    return Response(serializer.errors, status=400)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id, deleted_at__isnull=True)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=404)

    serializer = TaskCreateUpdateSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(TaskSerializer(task).data)

    return Response(serializer.errors, status=400)
from django.utils.timezone import now

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.deleted_at = now()
        task.save()
        return Response({"message": "Task deleted"})
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=404)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_task_user(request):
    task_id = request.data.get("task")
    employee_id = request.data.get("employee")

    assignment, created = TaskAssignment.objects.get_or_create(
        task_id=task_id,
        employee_id=employee_id,
        defaults={"assigned_by": request.user}
    )

    return Response(TaskAssignmentSerializer(assignment).data, status=201)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unassign_task_user(request):
    task_id = request.data.get("task")
    employee_id = request.data.get("employee")

    try:
        assignment = TaskAssignment.objects.get(
            task_id=task_id,
            employee_id=employee_id,
            unassigned_at__isnull=True
        )
        assignment.unassigned_at = now()
        assignment.save()
        return Response({"message": "User unassigned"})
    except TaskAssignment.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=404)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_task_order(request):
    """
    payload:
    [
      { "id": 5, "status": "todo", "board_order": 0 },
      { "id": 8, "status": "in_progress", "board_order": 1 }
    ]
    """
    for item in request.data:
        Task.objects.filter(id=item["id"]).update(
            status=item["status"],
            board_order=item["board_order"]
        )

    return Response({"message": "Board updated"})
