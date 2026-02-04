from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tasks.models import Task
from accounts.models import User, Project, Client


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    data = {
    "total_projects": Project.objects.count(),

    # 👇 exact status counts
    "projects_not_started": Project.objects.filter(status="not_started").count(),
    "projects_in_progress": Project.objects.filter(status="in_progress").count(),
    "projects_completed": Project.objects.filter(status="completed").count(),

    "total_clients": Client.objects.count(),
    "active_clients": Client.objects.filter(
        projects__status__in=["not_started", "in_progress", "on_hold"]
    ).distinct().count(),

    "total_tasks": Task.objects.count(),
    "tasks_todo": Task.objects.filter(status="todo").count(),
    "tasks_in_progress": Task.objects.filter(status="in_progress").count(),
    "tasks_done": Task.objects.filter(status="done").count(),
}


    return Response(data)
