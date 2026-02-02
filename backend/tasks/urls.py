from django.urls import path
from . import views

urlpatterns = [
    path("task-types/", views.list_task_types),
    path("tasks/", views.create_task),
    path("tasks/project/<int:project_id>/", views.list_tasks_by_project),
    path("tasks/<int:task_id>/", views.update_task),
    path("tasks/<int:task_id>/delete/", views.delete_task),
    path("projects/<int:project_id>/tasks/", views.project_tasks),
    path("tasks/assign/", views.assign_task_user),
    path("tasks/unassign/", views.unassign_task_user),

    path("tasks/reorder/", views.update_task_order),

]
