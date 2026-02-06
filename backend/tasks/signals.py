from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from tasks.models import Task
from tasks.utils import update_project_status

@receiver(post_save, sender=Task)
def task_saved(sender, instance, **kwargs):
    update_project_status(instance.project)

@receiver(post_delete, sender=Task)
def task_deleted(sender, instance, **kwargs):
    update_project_status(instance.project)
