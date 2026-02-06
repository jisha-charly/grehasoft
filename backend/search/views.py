from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import  Project,User


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def global_search(request):
    query = request.GET.get("q", "").strip()

    if not query:
        return Response({
            "projects": [],
            
            "users": []
        })

    projects = Project.objects.filter(name__icontains=query)[:5]
    
    users = User.objects.filter(username__icontains=query)[:5]

    return Response({
        "projects": [
            {"id": p.id, "name": p.name} for p in projects
        ],
        
        "users": [
            {"id": u.id, "username": u.username} for u in users
        ]
    })
