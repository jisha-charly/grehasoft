from rest_framework import serializers
from .models import Task, TaskType, TaskAssignment, TaskProgress, TaskFile
from accounts.models import Project
 # adjust import if needed


# =========================
# TASK TYPE
# =========================
class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = ["id", "name", "description", "created_at"]
        read_only_fields = ["created_at"]


# =========================
# TASK
# =========================
class TaskSerializer(serializers.ModelSerializer):
    task_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TaskType.objects.all(),
        source="task_type",
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "status",
            "board_order",
            "due_date",
            "task_type_id",
            "project",
            "task_type",
            "created_by",
            "created_at",
        ]
        read_only_fields = [
            "project",
            "task_type",
            "created_by",
            "created_at",
        ]



class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "title",
            "description",
            "task_type",
            "priority",
            "status",
            "board_order",
            "due_date",
        ]


# =========================
# TASK ASSIGNMENT
# =========================
class TaskAssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.username", read_only=True
    )

    class Meta:
        model = TaskAssignment
        fields = [
            "id",
            "task",
            "employee",
            "employee_name",
            "assigned_at",
            "unassigned_at",
        ]


# =========================
# TASK PROGRESS
# =========================
class TaskProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskProgress
        fields = "__all__"


# =========================
# TASK FILES
# =========================
import os

class TaskFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.username", read_only=True)
    file_url = serializers.SerializerMethodField(read_only=True)
    file_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TaskFile
        fields = [
            "id",
            "task",
            "uploaded_by",
            "uploaded_by_name",
            "file_path",
            "file_url",
            "file_name",
            "file_type",
            "revision_no",
            "uploaded_at",
            "deleted_at",
        ]
        read_only_fields = ["uploaded_by", "uploaded_at", "revision_no", "deleted_at", "file_url", "file_name"]
        extra_kwargs = {"task": {"required": False}}

    def get_file_url(self, obj):
        request = self.context.get("request") if hasattr(self, "context") else None
        try:
            url = obj.file_path.url
        except Exception:
            url = None
        if not url:
            return None
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_file_name(self, obj):
        try:
            return os.path.basename(obj.file_path.name)
        except Exception:
            return None
