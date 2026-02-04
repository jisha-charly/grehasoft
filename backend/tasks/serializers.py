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
        fields = ["id", "name"]


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
