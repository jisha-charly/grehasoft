from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    User,
    Role,
    Department,
    
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
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "department",
        "is_staff",
        "is_active",
    )

    # ✅ THIS IS THE KEY FIX
    list_display_links = ("username", "email")

    list_filter = (
        "role",
        "department",
        "is_staff",
        "is_active",
    )

    search_fields = ("username", "email")

    fieldsets = (
        ("Basic Info", {
            "fields": ("username", "email", "password")
        }),
        ("Role & Department", {
            "fields": ("role", "department")
        }),
        ("Permissions", {
            "fields": ("is_staff", "is_active", "is_superuser")
        }),
    )
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
        "derived_status",   # ✅ use property
        "progress_percentage",
        "created_at",
    )

    list_filter = (
        "department",
        "client",
    )

    search_fields = ("name",)

# ---------------------------
# PROJECT MILESTONE
# ---------------------------
@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "project", "due_date", "status")
    list_filter = ()
    search_fields = ("title", "project__name")


# ---------------------------
# PROJECT MEMBER
# ---------------------------
@admin.register(ProjectMember)
class ProjectMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "user", "role_in_project", "created_at")
    list_filter = ("role_in_project",)
    search_fields = ("user__username", "project__name")

