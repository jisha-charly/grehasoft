from django.urls import path
from . import views

urlpatterns = [
    # TASK TYPES
    path("task-types/", views.list_task_types),
    path("task-types/create/", views.create_task_type),
    path("task-types/<int:pk>/update/", views.update_task_type),
    path("task-types/<int:pk>/delete/", views.delete_task_type),

    # TASKS
    path("projects/<int:project_id>/tasks/", views.project_tasks),
    path("tasks/assign/", views.assign_task_user),
    path("tasks/unassign/", views.unassign_task_user),
    path("tasks/update-order/", views.update_task_order),
]
