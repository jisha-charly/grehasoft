from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.utils import timezone
from .models import Task, TaskType,TaskAssignment,TaskProgress
from .serializers import (
    TaskSerializer,
    TaskTypeSerializer,
    TaskCreateUpdateSerializer,TaskAssignmentSerializer,TaskProgressSerializer
)
from accounts.models import  Project
from rest_framework import status


# =================================================
# TASK TYPES
# =================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_task_types(request):
    task_types = TaskType.objects.filter(deleted_at__isnull=True)
    serializer = TaskTypeSerializer(task_types, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task_type(request):
    TaskType.objects.create(
        name=request.data.get("name"),
        description=request.data.get("description", ""),
    )
    return Response({"message": "Task type created"}, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task_type(request, pk):
    task_type = get_object_or_404(
        TaskType, pk=pk, deleted_at__isnull=True
    )
    task_type.name = request.data.get("name", task_type.name)
    task_type.description = request.data.get(
        "description", task_type.description
    )
    task_type.save()
    return Response({"message": "Task type updated"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task_type(request, pk):
    task_type = get_object_or_404(TaskType, pk=pk)
    task_type.deleted_at = now()
    task_type.save()
    return Response({"message": "Task type deleted"})


# =================================================
# TASKS
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


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def project_tasks(request, project_id):

    if request.method == "GET":
        tasks = Task.objects.filter(
            project_id=project_id,
            deleted_at__isnull=True
        ).order_by("board_order")
        return Response(TaskSerializer(tasks, many=True).data)

    if request.method == "POST":
        project = get_object_or_404(Project, id=project_id)

        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                project=project,              # ✅ FIX
                created_by=request.user
            )
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, deleted_at__isnull=True)
    serializer = TaskCreateUpdateSerializer(
        task, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(TaskSerializer(task).data)
    return Response(serializer.errors, status=400)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, id):
    task = get_object_or_404(Task, id=id, deleted_at__isnull=True)
    task.deleted_at = timezone.now()
    task.save()
    return Response(status=204)





@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_task(request, pk):
    """
    Assign / Unassign a task to an employee
    payload: { employee: user_id | null }
    """

    # 1️⃣ Get task
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(
            {"detail": "Task not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    employee_id = request.data.get("employee")

    # 2️⃣ UNASSIGN
    if employee_id is None:
        TaskAssignment.objects.filter(
            task=task,
            unassigned_at__isnull=True,
        ).update(unassigned_at=timezone.now())

        data = TaskSerializer(task).data
        data["assignment"] = None

        return Response(data, status=status.HTTP_200_OK)

    # 3️⃣ ASSIGN
    # Close existing assignment
    TaskAssignment.objects.filter(
        task=task,
        unassigned_at__isnull=True,
    ).update(unassigned_at=timezone.now())

    # Create new assignment
    assignment = TaskAssignment.objects.create(
        task=task,
        employee_id=employee_id,
        assigned_by=request.user,
    )

    # 4️⃣ Response
    data = TaskSerializer(task).data
    data["assignment"] = TaskAssignmentSerializer(assignment).data

    return Response(data, status=status.HTTP_200_OK)
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

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_task_status(request, pk):
    task = Task.objects.get(id=pk)
    task.status = request.data.get("status")
    task.save()
    return Response({"success": True})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_task_progress(request, pk):
    task = get_object_or_404(Task, pk=pk, deleted_at__isnull=True)

    serializer = TaskProgressSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(
            task=task,
            updated_by=request.user
        )
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_task_progress(request, pk):
    logs = TaskProgress.objects.filter(task_id=pk).order_by("-updated_at")
    serializer = TaskProgressSerializer(logs, many=True)
    return Response(serializer.data)
