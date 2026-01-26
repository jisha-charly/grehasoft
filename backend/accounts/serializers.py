import re
from rest_framework import serializers
from .models import Client
from .models import Project, ProjectMilestone, ProjectMember

class ClientSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z\s]{3,50}$', value):
            raise serializers.ValidationError(
                "Name must contain only letters (min 3 characters)"
            )
        return value

    def validate_email(self, value):
        return value.lower()

    def validate_phone(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError(
                "Phone must be a valid 10-digit Indian number"
            )
        return value

    def validate_gst_no(self, value):
        if value and not re.match(
            r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$', value
        ):
            raise serializers.ValidationError("Invalid GST number")
        return value

    class Meta:
        model = Client
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "company_name",
            "gst_no",
            "address",
            "created_at",
        ]
class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "client",
            "department",
            "project_manager",
            "start_date",
            "end_date",
            "status",
            "progress_percentage",
        ]
        read_only_fields = ["id"]

    def validate(self, data):
        start = data.get("start_date")
        end = data.get("end_date")
        if start and end and end < start:
            raise serializers.ValidationError(
                "End date cannot be before start date"
            )
        return data

    
    
class ProjectMilestoneSerializer(serializers.ModelSerializer):

     def validate_due_date(self, value):
        if not value:
            raise serializers.ValidationError("Due date is required")
        return value

     class Meta:
        model = ProjectMilestone
        fields = [
            "id",
            "project",
            "title",
            "due_date",
            "status",
            "created_at",
            "updated_at",
        ]
   
    
class ProjectMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    def validate(self, data):
        project = data.get("project")
        user = data.get("user")

        # 🔒 Prevent duplicate member (ONLY on create)
        if self.instance is None:
            if ProjectMember.objects.filter(
                project=project,
                user=user,
                deleted_at__isnull=True
            ).exists():
                raise serializers.ValidationError(
                    "User already added to this project"
                )

        return data

    class Meta:
        model = ProjectMember
        fields = [
            "id",
            "project",
            "user",
            "username",
            "role_in_project",
            "created_at",
            "updated_at",
        ]