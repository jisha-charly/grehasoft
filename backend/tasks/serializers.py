from rest_framework import serializers
from .models import Task, TaskType, TaskAssignment, TaskProgress,TaskComment,ProjectMilestone,TaskActivity,TaskReview,TaskFile
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

    # 🔥 ADD THIS FOR MILESTONE
    milestone = serializers.PrimaryKeyRelatedField(
        queryset=ProjectMilestone.objects.all(),
        required=False,
        allow_null=True,
    )

    # 🔹 Read-only project id
    project_id = serializers.IntegerField(
        source="project.id",
        read_only=True
    )

    # 🔥 Existing assignment
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
            "milestone",   # ✅ ADD THIS HERE

            "project",
            "project_id",
            "task_type",
            "created_by",
            "created_at",

            "assignment",
        ]

        read_only_fields = [
            "project",
            "project_id",
            "task_type",
            "created_by",
            "created_at",
            "assignment",
        ]

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
class TaskActivitySerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = TaskActivity
        fields = [
            "id",
            "action",
            "description",
            "user_name",
            "created_at",
        ]

from django.db.models import Max
from rest_framework import serializers


class TaskReviewSerializer(serializers.ModelSerializer):

    reviewer_name = serializers.CharField(
        source="reviewer.username",
        read_only=True
    )

    class Meta:
        model = TaskReview
        fields = [
            "id",
            "task_file",
            "status",
            "comments",
            "review_version",
            "reviewed_by_role",
            "reviewer_name",
            "reviewed_at",
        ]
        read_only_fields = [
            "task_file",
            "review_version",
            "reviewed_by_role",
            "reviewer_name",
            "reviewed_at",
        ]

    # ✅ Prevent duplicate same-role review on same version
    def validate(self, attrs):
        request = self.context["request"]
        task_file = self.context["task_file"]
        user = request.user

        role = "ADMIN" if user.role.name.lower() == "admin" else "PM"

        # Lock if file already approved
        if task_file.status == "approved":
            raise serializers.ValidationError(
                "File already approved. No more reviews allowed."
            )

        # Get latest version
        latest_version = TaskReview.objects.filter(
            task_file=task_file
        ).aggregate(Max("review_version"))["review_version__max"]

        # Prevent same role reviewing same version
        if latest_version:
            already_reviewed = TaskReview.objects.filter(
                task_file=task_file,
                reviewed_by_role=role,
                review_version=latest_version
            ).exists()

            if already_reviewed:
                raise serializers.ValidationError(
                    "You have already reviewed this version."
                )

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        task_file = self.context["task_file"]
        user = request.user

        role = "ADMIN" if user.role.name.lower() == "admin" else "PM"

        # Get last review by same role
        last_review = TaskReview.objects.filter(
            task_file=task_file,
            reviewed_by_role=role
        ).order_by("-review_version").first()

        review_version = 1
        if last_review:
            review_version = last_review.review_version + 1

        review = TaskReview.objects.create(
            task_file=task_file,
            reviewer=user,
            reviewed_by_role=role,
            review_version=review_version,
            **validated_data
        )

        # ✅ Auto update file status (ADMIN only)
        if role == "ADMIN":
            task_file.status = validated_data["status"]
            task_file.save()

        return review

class TaskFileSerializer(serializers.ModelSerializer):

    uploaded_by_name = serializers.CharField(
        source="uploaded_by.username",
        read_only=True
    )

    reviews = TaskReviewSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = TaskFile
        fields = [
            "id",
            "file",
            "file_type",
            "revision_no",
            "uploaded_by",
            "uploaded_by_name",
            "uploaded_at",
            "reviews",
            "status",
        ] 

class TaskFileUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskFile
        fields = ["id", "file"]

    def create(self, validated_data):
        task = self.context["task"]
        user = self.context["request"].user

        last_revision = TaskFile.objects.filter(
            task=task
        ).order_by("-revision_no").first()

        revision_no = 1
        if last_revision:
            revision_no = last_revision.revision_no + 1

        return TaskFile.objects.create(
            task=task,
            uploaded_by=user,
            revision_no=revision_no,
            **validated_data
        )
