from django.urls import path
from .views import (
    login_view,
    users_list,
    create_user,
    update_user,
    delete_user
)

urlpatterns = [
    path("login/", login_view),
    path("users/", users_list),
    path("users/create/", create_user),
    path("users/<int:user_id>/update/", update_user),
    path("users/<int:user_id>/delete/", delete_user),
]
