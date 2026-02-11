from django.urls import path
from . import views

urlpatterns = [

   # task types
path("task-types/", views.list_task_types),
path("task-types/create/", views.create_task_type),
path("task-types/<int:pk>/update/", views.update_task_type),
path("task-types/<int:pk>/delete/", views.delete_task_type),


    path("projects/<int:project_id>/tasks/", views.project_tasks),

    path("tasks/<int:pk>/assign/", views.assign_task, name="assign-task"),

    path("tasks/<int:pk>/progress/", views.get_task_progress),
    path("tasks/<int:pk>/progress/add/", views.add_task_progress),

    # ✅ UPDATE TASK (PUT / PATCH)
    path("tasks/<int:pk>/update/", views.update_task, name="update_task"),

    # ✅ DELETE TASK (DELETE)
    path("tasks/<int:pk>/delete/", views.delete_task, name="delete_task"),

    path("tasks/update-order/", views.update_task_order),
    path("tasks/<int:pk>/status/", views.update_task_status),


   
path(
        "tasks/<int:task_id>/comments/",
        views.TaskCommentListCreateView.as_view(),
        name="task-comments",
    ),
]
