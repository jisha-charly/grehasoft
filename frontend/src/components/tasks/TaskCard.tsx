import type { Task } from "../../types/task";

interface Props {
  task: Task;
}

const TaskCard = ({ task }: Props) => {
  return (
    <div className="card mb-2 shadow-sm border-0">
      <div className="card-body p-2">
        <h6 className="mb-1">{task.title}</h6>

        <small className="text-muted">
          Priority: {task.priority ?? "medium"}
        </small>
      </div>
    </div>
  );
};

export default TaskCard;
