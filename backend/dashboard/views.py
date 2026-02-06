from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tasks.models import Task
from accounts.models import Project, Client
from tasks.utils import derive_project_status


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    projects = Project.objects.all().prefetch_related("tasks")

    total_projects = projects.count()

    projects_not_started = 0
    projects_in_progress = 0
    projects_completed = 0

    for project in projects:
        status = derive_project_status(project)

        if status == "in_progress":
            projects_in_progress += 1
        elif status == "completed":
            projects_completed += 1
        else:
            projects_not_started += 1

    data = {
        "total_projects": total_projects,

        # ✅ DERIVED project status counts
        "projects_not_started": projects_not_started,
        "projects_in_progress": projects_in_progress,
        "projects_completed": projects_completed,

        # Clients
        "total_clients": Client.objects.count(),
        "active_clients": Client.objects.filter(
            projects__in=projects
        ).distinct().count(),

        # Tasks
        "total_tasks": Task.objects.count(),
        "tasks_todo": Task.objects.filter(status="todo").count(),
        "tasks_in_progress": Task.objects.filter(status="in_progress").count(),
        "tasks_done": Task.objects.filter(status="done").count(),
    }

    return Response(data)
