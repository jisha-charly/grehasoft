import re
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import serializers
from .models import Client
from .models import Project, ProjectMilestone, ProjectMember
from .models import Department
from tasks.utils import derive_project_status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(id=user.id).filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        user = self.instance
        if value and User.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
class DepartmentSerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(
        source="parent.name",
        read_only=True
    )

    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "parent",
            "parent_name",
            "created_at",
            "updated_at",
        ]

class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(
        source="role.name", read_only=True
    )
    department_name = serializers.CharField(
        source="department.name", read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "role_name",
            "department",
            "department_name",
            "is_active",
        ]




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
    derived_status = serializers.SerializerMethodField()

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
            "status",              # optional (can remove later)
            "progress_percentage",
            "derived_status",      # 👈 THIS was missing
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

    def get_derived_status(self, obj):
        return derive_project_status(obj)
    
    
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
        # ================= LIST USER =================
class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "role_name",
            "department",
            "department_name",
            "is_active",
        ]


# ================= CREATE USER =================
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "department"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.save()
        return user


# ================= UPDATE USER =================
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "role", "department", "is_active"]

    def validate_email(self, value):
        user_id = self.instance.id
        if User.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
# ================= login =================
    
class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": {
                "id": user.role.id if user.role else None,
                "name": user.role.name if user.role else None,
            },
        }

        return data