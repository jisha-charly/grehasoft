from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
class Department(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,  # ✅ IMPORTANT
        related_name="sub_departments"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


  


class User(AbstractUser):
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users"
    )

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="active"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username
    
    
    
    
    

    
     # ✅ THIS LINE WAS MISSING
class Client(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150)
    phone = models.CharField(max_length=20)
    company_name = models.CharField(max_length=200)
    gst_no = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

class Project(models.Model):

    name = models.CharField(max_length=255)

    client = models.ForeignKey(
        "accounts.Client",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="projects"
    )

    department = models.ForeignKey(
        "accounts.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="projects"
    )

    project_manager = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_projects"
    )

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    # =====================================================
    # 🔥 DERIVED STATUS (Dynamic - Enterprise Safe)
    # =====================================================
    @property
    def derived_status(self):
        tasks = self.tasks.filter(deleted_at__isnull=True)

        total = tasks.count()

        if total == 0:
            return "pending"

        done_count = tasks.filter(status="done").count()
        in_progress_count = tasks.filter(status="in_progress").count()

        if done_count == total:
            return "completed"

        if in_progress_count > 0 or done_count > 0:
            return "in_progress"

        return "pending"

    # =====================================================
    # 📊 DYNAMIC PROGRESS %
    # =====================================================
    @property
    def progress_percentage(self):
        tasks = self.tasks.filter(deleted_at__isnull=True)

        total = tasks.count()

        if total == 0:
            return 0

        done_count = tasks.filter(status="done").count()

        return int((done_count / total) * 100)

    

class ProjectMilestone(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="milestones"
    )

    title = models.CharField(max_length=200)
    due_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def update_status(self):
     tasks = self.tasks.filter(deleted_at__isnull=True)

     if not tasks.exists():
        self.status = "pending"
        self.save(update_fields=["status"])
        return

     total = tasks.count()
     done_count = tasks.filter(status="done").count()
     in_progress_count = tasks.filter(status="in_progress").count()

     if done_count == total:
        self.status = "completed"

     elif in_progress_count > 0 or done_count > 0:
        self.status = "in_progress"

     else:
        self.status = "pending"

     self.save(update_fields=["status"])


    def __str__(self):
        return self.title


    # ===============================
    # OPTIONAL: PROGRESS PERCENT
    # ===============================
    @property
    def progress_percentage(self):
        total_tasks = self.tasks.filter(
            deleted_at__isnull=True
        ).count()

        if total_tasks == 0:
            return 0

        completed_tasks = self.tasks.filter(
            status="done",
            deleted_at__isnull=True
        ).count()

        return int((completed_tasks / total_tasks) * 100)
    


class ProjectMember(models.Model):

    ROLE_CHOICES = [
        ("PM", "Project Manager"),
        ("MEMBER", "Member"),
        ("QA", "QA"),
        ("VIEWER", "Viewer"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="members"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    role_in_project = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    # ✅ AUDIT FIELDS
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("project", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.project.name} ({self.role_in_project})"

    # ✅ SOFT DELETE
    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()


