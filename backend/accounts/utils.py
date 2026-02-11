def derive_milestone_status(milestone):
    tasks = milestone.tasks.all()

    if not tasks.exists():
        return "pending"

    total = tasks.count()
    done = tasks.filter(status="done").count()

    if done == total:
        return "completed"

    if done > 0:
        return "in_progress"

    return "pending"
