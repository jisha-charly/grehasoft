from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

# -------------------------------------------------
# LOGIN (JWT handled separately via /api/token/)
# -------------------------------------------------
@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        return Response(
            {
                "message": "Login successful",
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )

    return Response(
        {"error": "Invalid username or password"},
        status=status.HTTP_401_UNAUTHORIZED,
    )


# -------------------------------------------------
# LIST USERS (ADMIN ONLY)
# -------------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    if request.user.role != "ADMIN":
        return Response(
            {"error": "Only admin can view users"},
            status=status.HTTP_403_FORBIDDEN,
        )

    users = User.objects.all().values(
        "id",
        "username",
        "email",
        "role",
        "is_active",
    )

    return Response(list(users), status=status.HTTP_200_OK)


# -------------------------------------------------
# CREATE USER (ADMIN ONLY)
# -------------------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    if request.user.role != "ADMIN":
        return Response(
            {"error": "Only admin can create users"},
            status=status.HTTP_403_FORBIDDEN,
        )

    data = request.data

    if User.objects.filter(username=data.get("username")).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    role = data.get("role", "SOFTWARE_EMP")

    user = User.objects.create_user(
        username=data["username"],
        email=data.get("email", ""),
        password=data["password"],
        role=role,
        is_staff=role in ["ADMIN", "SOFTWARE_PM", "DM_PM"],
    )

    return Response(
        {"message": "User created successfully"},
        status=status.HTTP_201_CREATED,
    )


# -------------------------------------------------
# UPDATE USER (ADMIN ONLY)
# -------------------------------------------------
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    if request.user.role != "ADMIN":
        return Response(
            {"error": "Only admin can update users"},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    data = request.data

    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)
    user.is_active = data.get("is_active", user.is_active)

    # staff flag derived from role
    user.is_staff = user.role in ["ADMIN", "SOFTWARE_PM", "DM_PM"]

    user.save()

    return Response(
        {"message": "User updated successfully"},
        status=status.HTTP_200_OK,
    )


# -------------------------------------------------
# DELETE USER (ADMIN ONLY)
# -------------------------------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if request.user.role != "ADMIN":
        return Response(
            {"error": "Only admin can delete users"},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        user = User.objects.get(id=user_id)

        # Optional safety: prevent deleting yourself
        if user.id == request.user.id:
            return Response(
                {"error": "Admin cannot delete own account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_200_OK,
        )

    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
