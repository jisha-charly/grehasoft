from rest_framework import serializers
from .models import Task, TaskType, TaskAssignment, TaskProgress,TaskComment
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
    # 🔹 Write-only for task type
    task_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TaskType.objects.all(),
        source="task_type",
        write_only=True,
        required=False,
        allow_null=True,
    )

    # 🔹 Read-only project id
    project_id = serializers.IntegerField(
        source="project.id",
        read_only=True
    )

    # 🔥 ADD THIS
    assignment = serializers.SerializerMethodField()

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
            "project_id",
            "task_type",
            "created_by",
            "created_at",

            "assignment",   # 🔥 ADD THIS
        ]

        read_only_fields = [
            "project",
            "project_id",
            "task_type",
            "created_by",
            "created_at",
            "assignment",   # 🔥 ADD THIS
        ]

    # 🔥 ADD THIS METHOD
    def get_assignment(self, obj):
        active_assignment = obj.assignments.filter(
            unassigned_at__isnull=True
        ).first()

        if active_assignment:
            return {
                "employee_id": active_assignment.employee.id,
                "employee_name": active_assignment.employee.username,
            }

        return None


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
    class Meta:
        model = TaskProgress
        fields = [
            "id",
            "status",
            "comment",
            "updated_at",
            "updated_by",
        ]
        read_only_fields = ["id", "updated_at", "updated_by"]

# =================================================
# TASK COMMENT SERIALIZER
# =================================================
class TaskCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = TaskComment
        fields = [
            "id",
            "task",
            "user",
            "username",
            "comment",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "task",          # ✅ ADD THIS
            "user",
            "username",
            "created_at",
        ]
