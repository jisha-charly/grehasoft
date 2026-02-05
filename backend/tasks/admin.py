from django.contrib import admin
from .models import Task, TaskType, TaskAssignment, TaskProgress, TaskFile

@admin.register(TaskType)
class TaskTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "project", "status", "priority", "created_at")

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "employee", "assigned_at")

@admin.register(TaskProgress)
class TaskProgressAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "status", "updated_by", "updated_at")

@admin.register(TaskFile)
class TaskFileAdmin(admin.ModelAdmin):
    list_display = ("id", "task", "file_path", "uploaded_by", "revision_no", "uploaded_at", "deleted_at")
    readonly_fields = ("uploaded_at",)
