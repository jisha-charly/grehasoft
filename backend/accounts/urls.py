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
    # clients
    path("clients/", views.list_clients),
    path("clients/create/", views.create_client),
    path("clients/<int:id>/update/", views.update_client),
    path("clients/<int:id>/delete/", views.delete_client),
     # projects
    path("projects/", views.list_projects),
    path("projects/create/", views.create_project),
    path("projects/<int:id>/update/", views.update_project),
    path("projects/<int:id>/delete/", views.delete_project),
    path("projects/<int:id>/", views.get_project),

    
    # Milestones
    path("projects/<int:project_id>/milestones/", views.list_milestones),
    path("projects/<int:project_id>/milestones/create/",views.create_milestone),
    path("milestones/<int:id>/update/",views.update_milestone),
    path("milestones/<int:id>/delete/",views.delete_milestone ),
    path("milestones/<int:id>/complete/",views.complete_milestone),
   
    # Project Members
    path( "projects/<int:project_id>/members/",views.list_project_members),
       
    path("projects/<int:project_id>/members/add/",views.add_project_member),
        
    path( "project-members/<int:id>/update/",views.update_project_member),
       
    path("project-members/<int:id>/remove/", views.remove_project_member),


]



