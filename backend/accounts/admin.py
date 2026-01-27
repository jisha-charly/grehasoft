from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    User,
    Role,
    Department,
    TaskType,
    Client,
    Project,
    ProjectMilestone,
    ProjectMember,
)

# ---------------------------
# ROLE
# ---------------------------
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    search_fields = ("name",)
    list_filter = ("created_at",)
    ordering = ("name",)


# ---------------------------
# DEPARTMENT
# ---------------------------
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "parent", "created_at")
    search_fields = ("name",)
    list_filter = ("created_at",)


# ---------------------------
# USER (Custom User)
# ---------------------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "department",
        "status",
        "is_staff",
        "is_active",
    )
    list_filter = ("role", "department", "status", "is_staff")
    search_fields = ("username", "email")
    ordering = ("username",)

    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Organization Info",
            {
                "fields": (
                    "role",
                    "department",
                    "status",
                )
            },
        ),
    )


# ---------------------------
# TASK TYPE
# ---------------------------
@admin.register(TaskType)
class TaskTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)


# ---------------------------
# CLIENT
# ---------------------------
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "company_name", "email", "phone")
    search_fields = ("name", "company_name", "email")
    list_filter = ("created_at",)


# ---------------------------
# PROJECT
# ---------------------------
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "client",
        "department",
        "project_manager",
        "status",
        "progress_percentage",
    )
    list_filter = ("status", "department")
    search_fields = ("name", "client__name")
    ordering = ("-created_at",)


# ---------------------------
# PROJECT MILESTONE
# ---------------------------
@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "project", "due_date", "status")
    list_filter = ("status",)
    search_fields = ("title", "project__name")


# ---------------------------
# PROJECT MEMBER
# ---------------------------
@admin.register(ProjectMember)
class ProjectMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "user", "role_in_project", "created_at")
    list_filter = ("role_in_project",)
    search_fields = ("user__username", "project__name")

