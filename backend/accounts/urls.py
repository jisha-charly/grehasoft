from django.urls import path
from . import views  # 👈 THIS IS THE KEY FIX

urlpatterns = [
    # auth
    path("login/", views.login_view),

    # users
    path("users/", views.users_list),
    path("users/create/", views.create_user),
    path("users/<int:user_id>/update/", views.update_user),
    path("users/<int:user_id>/delete/", views.delete_user),
# departments
path("departments/", views.list_departments),
    path("departments/create/", views.create_department),
    path("departments/<int:dept_id>/update/", views.update_department),
    path("departments/<int:dept_id>/delete/", views.delete_department),

    # roles
    path("roles/", views.list_roles),
    path("roles/create/", views.create_role),
    path("roles/<int:role_id>/update/", views.update_role),
    path("roles/<int:role_id>/delete/", views.delete_role),
    # tasktypes
    path("task-types/", views.list_task_types),
    path("task-types/create/", views.create_task_type),
    path("task-types/<int:pk>/update/", views.update_task_type),  # ✅ EDIT
    path("task-types/<int:pk>/delete/", views.delete_task_type),
]
