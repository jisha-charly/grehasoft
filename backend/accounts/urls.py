from django.urls import path
from . import views   # 👈 THIS IS THE KEY FIX

urlpatterns = [
    # auth
    path("login/", views.login_view),

    # users
    path("users/", views.users_list),
    path("users/create/", views.create_user),
    path("users/<int:user_id>/update/", views.update_user),
    path("users/<int:user_id>/delete/", views.delete_user),

    # roles
    path("roles/", views.list_roles),
    path("roles/create/", views.create_role),
    path("roles/<int:role_id>/update/", views.update_role),
    path("roles/<int:role_id>/delete/", views.delete_role),
]
