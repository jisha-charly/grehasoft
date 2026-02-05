from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Max

from .models import Task, TaskType, TaskAssignment, TaskFile
from .serializers import (
    TaskSerializer,
    TaskTypeSerializer,
    TaskCreateUpdateSerializer,TaskAssignmentSerializer, TaskFileSerializer,
)
from accounts.models import  Project


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

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task(request, task_id):
    task = get_object_or_404(
        Task, id=task_id, deleted_at__isnull=True
    )
    serializer = TaskCreateUpdateSerializer(
        task, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(TaskSerializer(task).data)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.deleted_at = now()
    task.save()
    return Response({"message": "Task deleted"})


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


# =================================================
# TASK FILES
# =================================================
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def task_files(request, task_id):
    task = get_object_or_404(Task, id=task_id, deleted_at__isnull=True)

    if request.method == "GET":
        files = TaskFile.objects.filter(task=task, deleted_at__isnull=True).order_by("uploaded_at")
        return Response(TaskFileSerializer(files, many=True).data)

    # POST - upload file (expect multipart/form-data with 'file_path')
    serializer = TaskFileSerializer(data=request.data)
    if serializer.is_valid():
        # determine revision_no by filename (basic approach)
        filename = None
        if "file_path" in request.FILES:
            filename = request.FILES["file_path"].name
        if filename:
            last_rev = TaskFile.objects.filter(task=task, file_path__icontains=filename).aggregate(Max("revision_no"))["revision_no__max"] or 0
            revision_no = last_rev + 1
        else:
            revision_no = 1

        serializer.save(task=task, uploaded_by=request.user, revision_no=revision_no)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task_file(request, file_id):
    task_file = get_object_or_404(TaskFile, id=file_id)
    task_file.deleted_at = now()
    task_file.save()
    return Response({"message": "File deleted"})


