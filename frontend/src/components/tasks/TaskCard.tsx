import type { Task } from "../../types/task";

interface Props {
  task: Task;
  onClick?: (task: Task) => void;
}

const statusColor: any = {
  todo: "secondary",
  in_progress: "primary",
  done: "success",
  blocked: "danger",
};

const TaskCard = ({ task, onClick }: Props) => {
  return (
    <div
      className="card mb-2 shadow-sm task-card"
      role="button"
      onClick={() => onClick && onClick(task)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body p-2">
        <h6 className="mb-1">{task.title}</h6>

        <div className="d-flex justify-content-between align-items-center">
          {task.task_type_name && (
            <span className="badge bg-info text-dark">
              {task.task_type_name}
            </span>
          )}

          <span className={`badge bg-${statusColor[task.status]}`}>
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
