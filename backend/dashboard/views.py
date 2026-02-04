from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tasks.models import Task
from accounts.models import User, Project, Client


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    data = {
        # Projects
        "total_projects": Project.objects.count(),
        "ongoing_projects": Project.objects.filter(
            status__in=["not_started", "in_progress", "on_hold"]
        ).count(),
        "completed_projects": Project.objects.filter(
            status="completed"
        ).count(),

        # Clients (✅ FIXED)
        "total_clients": Client.objects.count(),
        "active_clients": Client.objects.filter(
            projects__status__in=["not_started", "in_progress", "on_hold"]
        ).distinct().count(),

        # Users
        "total_users": User.objects.count(),

        # Tasks
        "total_tasks": Task.objects.count(),
        "tasks_todo": Task.objects.filter(status="todo").count(),
        "tasks_in_progress": Task.objects.filter(status="in_progress").count(),
        "tasks_done": Task.objects.filter(status="done").count(),
    }

    return Response(data)
