from django.urls import path
from . import views

urlpatterns = [
    #profile
    path("profile/update/", views.update_profile, name="update-profile"),
    path("profile/change-password/", views.change_password, name="change-password"),
    # ---------------- USERS ----------------
    path("users/", views.users_list_create),
    path("users/<int:user_id>/", views.user_update_delete),

    # ---------------- DEPARTMENTS ----------------
    path("departments/", views.list_departments),
    path("departments/create/", views.create_department),
    path("departments/<int:dept_id>/update/", views.update_department),
    path("departments/<int:dept_id>/delete/", views.delete_department),

    # ---------------- ROLES ----------------
    # ROLES
    # ========================
    path("roles/", views.list_roles),
    path("roles/create/", views.create_role),
    path("roles/<int:role_id>/update/", views.update_role),
    path("roles/<int:role_id>/delete/", views.delete_role),

    # ---------------- TASK TYPES ----------------
    path("task-types/", views.list_task_types),
    path("task-types/create/", views.create_task_type),
    path("task-types/<int:pk>/update/", views.update_task_type),
    path("task-types/<int:pk>/delete/", views.delete_task_type),

    # ---------------- CLIENTS ----------------
    path("clients/", views.list_clients),
    path("clients/create/", views.create_client),
    path("clients/<int:id>/update/", views.update_client),
    path("clients/<int:id>/delete/", views.delete_client),

    # ---------------- PROJECTS ----------------
    path("projects/", views.list_projects),
    path("projects/create/", views.create_project),
    path("projects/<int:id>/", views.get_project),
    path("projects/<int:id>/update/", views.update_project),
    path("projects/<int:id>/delete/", views.delete_project),

    # ---------------- MILESTONES ----------------
    path("projects/<int:project_id>/milestones/", views.list_milestones),
    path("projects/<int:project_id>/milestones/create/", views.create_milestone),
    path("milestones/<int:id>/update/", views.update_milestone),
    path("milestones/<int:id>/delete/", views.delete_milestone),
    path("milestones/<int:id>/complete/", views.complete_milestone),

    # ---------------- PROJECT MEMBERS ----------------
    path("projects/<int:project_id>/members/", views.list_project_members),
    path("projects/<int:project_id>/members/add/", views.add_project_member),
    path("project-members/<int:id>/update/", views.update_project_member),
    path("project-members/<int:id>/remove/", views.remove_project_member),
 # ---------------- TASK MANAGEMENT----------------

    path("tasks/project/<int:project_id>/", views.list_tasks_by_project),
    path("tasks/", views.create_task),
    path("tasks/<int:task_id>/", views.update_task),
    path("tasks/<int:task_id>/delete/", views.delete_task),
path("projects/<int:project_id>/tasks/", views.project_tasks),
    path("tasks/assign/", views.assign_task_user),
    path("tasks/unassign/", views.unassign_task_user),

    path("tasks/reorder/", views.update_task_order),
]
