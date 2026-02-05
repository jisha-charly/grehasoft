from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile

from accounts.models import Role, Department, Client as ClientModel, User, Project
from tasks.models import Task, TaskFile, TaskType

import datetime


class TaskFileAPITests(APITestCase):
    def setUp(self):
        # Create minimal data: role, department, user, client, project, task
        self.role = Role.objects.create(name="tester")
        self.department = Department.objects.create(name="dev")
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password123",
        )
        self.client_obj = ClientModel.objects.create(
            name="ACME",
            email="acme@example.com",
            phone="1234567890",
            company_name="ACME Co",
            address="123 Road",
        )
        self.project = Project.objects.create(
            name="Test Project",
            client=self.client_obj,
            department=self.department,
            project_manager=self.user,
            created_by=self.user,
            start_date=datetime.date.today(),
        )
        self.task = Task.objects.create(
            title="Sample Task",
            project=self.project,
            created_by=self.user,
        )

        self.api = APIClient()
        self.api.force_authenticate(user=self.user)

    def test_upload_and_list_task_files(self):
        url = f"/api/tasks/{self.task.id}/files/"
        file_content = b"hello"
        uploaded = SimpleUploadedFile("test.txt", file_content, content_type="text/plain")

        response = self.api.post(url, {"file_path": uploaded, "file_type": "text"}, format="multipart")
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.data)

        # Verify saved in DB
        files = TaskFile.objects.filter(task=self.task, deleted_at__isnull=True)
        self.assertEqual(files.count(), 1)
        tf = files.first()
        self.assertEqual(tf.revision_no, 1)
        self.assertEqual(tf.uploaded_by, self.user)

        # List endpoint
        list_resp = self.api.get(url)
        self.assertEqual(list_resp.status_code, 200)
        self.assertEqual(len(list_resp.data), 1)

    def test_delete_task_file_soft_delete(self):
        # Upload a file first
        uploaded = SimpleUploadedFile("test2.txt", b"data", content_type="text/plain")
        post_resp = self.api.post(f"/api/tasks/{self.task.id}/files/", {"file_path": uploaded}, format="multipart")
        self.assertEqual(post_resp.status_code, 201)

        file_id = post_resp.data["id"]
        # Delete
        del_resp = self.api.delete(f"/api/tasks/files/{file_id}/delete/")
        self.assertEqual(del_resp.status_code, 200)

        tf = TaskFile.objects.get(id=file_id)
        self.assertIsNotNone(tf.deleted_at)

        # Ensure list endpoint excludes deleted
        list_resp = self.api.get(f"/api/tasks/{self.task.id}/files/")
        self.assertEqual(list_resp.status_code, 200)
        self.assertEqual(len(list_resp.data), 0)
