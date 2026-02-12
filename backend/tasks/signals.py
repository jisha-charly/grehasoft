from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import Task, TaskActivity, TaskAssignment



# =================================================
# STORE OLD VALUES BEFORE UPDATE
# =================================================

@receiver(pre_save, sender=Task)
def store_old_task_values(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = Task.objects.get(pk=instance.pk)
            instance._old_status = old.status
            instance._old_description = old.description
            instance._old_priority = old.priority
        except Task.DoesNotExist:
            pass


# =================================================
# TASK CREATED + UPDATED
# =================================================

@receiver(post_save, sender=Task)
def log_task_activity(sender, instance, created, **kwargs):

    safe_user = instance.created_by if instance.created_by else None

    if created:
        TaskActivity.objects.create(
            task=instance,
            user=safe_user,
            action="created",
            description="Task created"
        )
        return

    # STATUS CHANGED
    if hasattr(instance, "_old_status") and instance._old_status != instance.status:
        TaskActivity.objects.create(
            task=instance,
            user=safe_user,
            action="status_changed",
            description=f"Status changed from {instance._old_status} to {instance.status}"
        )

    # DESCRIPTION CHANGED
    if hasattr(instance, "_old_description") and instance._old_description != instance.description:
        TaskActivity.objects.create(
            task=instance,
            user=safe_user,
            action="updated",
            description="Description updated"
        )

    # PRIORITY CHANGED
    if hasattr(instance, "_old_priority") and instance._old_priority != instance.priority:
        TaskActivity.objects.create(
            task=instance,
            user=safe_user,
            action="updated",
            description=f"Priority changed to {instance.priority}"
        )


# =================================================
# STORE OLD ASSIGNMENT BEFORE UPDATE
# =================================================

@receiver(pre_save, sender=TaskAssignment)
def store_old_assignment(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = TaskAssignment.objects.get(pk=instance.pk)
            instance._old_employee = old.employee
        except TaskAssignment.DoesNotExist:
            pass


# =================================================
# LOG ASSIGNMENT CHANGE
# =================================================

@receiver(post_save, sender=TaskAssignment)
def log_assignment_activity(sender, instance, created, **kwargs):

    if created:
        TaskActivity.objects.create(
            task=instance.task,
            user=instance.employee,
            action="assigned",
            description=f"Assigned to {instance.employee.username}"
        )
        return

    if hasattr(instance, "_old_employee") and instance._old_employee != instance.employee:
        TaskActivity.objects.create(
            task=instance.task,
            user=instance.employee,
            action="assigned",
            description=f"Reassigned to {instance.employee.username}"
        )


# ==============================================
# UPDATE MILESTONE STATUS WHEN TASK CHANGES
# ==============================================

@receiver(post_save, sender=Task)
def update_milestone_on_task_save(sender, instance, **kwargs):
    print("SIGNAL TRIGGERED")
    if instance.milestone:
        print("Updating milestone:", instance.milestone.title)
        instance.milestone.update_status()


@receiver(post_delete, sender=Task)
def update_milestone_on_task_delete(sender, instance, **kwargs):
    if instance.milestone:
        instance.milestone.update_status()
