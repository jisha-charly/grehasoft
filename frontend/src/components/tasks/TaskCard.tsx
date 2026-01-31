import type { Task } from "../../types/task";

interface Props {
  task: Task;
}

const statusColor: Record<string, string> = {
  todo: "secondary",
  in_progress: "primary",
  done: "success",
  blocked: "danger",
};

const TaskCard = ({ task }: Props) => {
  return (
    <div
      className="card mb-3 shadow-sm border-0"
      style={{ cursor: "grab" }}
    >
      <div className="card-body p-3">
        {/* Title */}
        <h6 className="mb-2 fw-semibold">{task.title}</h6>

        {/* Task Type */}
        {task.task_type_name && (
          <span className="badge bg-info text-dark me-2">
            {task.task_type_name}
          </span>
        )}

        {/* Status */}
        <span className={`badge bg-${statusColor[task.status]}`}>
          {task.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
