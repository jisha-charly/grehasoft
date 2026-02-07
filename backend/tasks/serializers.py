from rest_framework import serializers
from .models import Task, TaskType, TaskAssignment, TaskProgress
from accounts.models import Project
 # adjust import if needed


# =========================
# TASK TYPE
# =========================
class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = [
            "id",
            "name",
            "description",
            "created_at",
        ]


# =========================
# TASK
# =========================
class TaskSerializer(serializers.ModelSerializer):
    # 🔹 For creating/updating task type
    task_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TaskType.objects.all(),
        source="task_type",
        write_only=True,
        required=False,
        allow_null=True,
    )

    # ✅ ADD THIS (frontend needs it)
    project_id = serializers.IntegerField(
        source="project.id",
        read_only=True
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

            # write-only
            "task_type_id",

            # read-only
            "project",
            "project_id",   # ✅ IMPORTANT
            "task_type",
            "created_by",
            "created_at",
        ]

        read_only_fields = [
            "project",
            "project_id",
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



class TaskAssignSerializer(serializers.Serializer):
    employee = serializers.IntegerField(
        required=False,
        allow_null=True
    )

class TaskAssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.username",
        read_only=True
    )

    class Meta:
        model = TaskAssignment
        fields = [
            "id",
            "employee",
            "employee_name",
            "assigned_at",
            "unassigned_at",
        ]

# =========================
# TASK PROGRESS
# =========================
# tasks/serializers.py
class TaskProgressSerializer(serializers.ModelSerializer):
    updated_by_name = serializers.CharField(
        source="updated_by.username",
        read_only=True
    )

    class Meta:
        model = TaskProgress
        fields = [
            "id",
            "task",
            "note",
            "percentage",
            "updated_by",
            "updated_by_name",
            "created_at",
        ]
        read_only_fields = ["updated_by", "created_at"]
