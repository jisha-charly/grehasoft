from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from .models import Task, TaskType
from .serializers import (
    TaskSerializer,
    TaskTypeSerializer,
    TaskCreateUpdateSerializer,
)


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
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
