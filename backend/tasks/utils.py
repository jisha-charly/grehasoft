from tasks.models import Task

def derive_project_status(project):
    tasks = Task.objects.filter(project=project)

    if not tasks.exists():
        return "not_started"

    if tasks.filter(status__in=["todo", "in_progress"]).exists():
        return "in_progress"

    if tasks.filter(status="done").count() == tasks.count():
        return "completed"

    return "not_started"

