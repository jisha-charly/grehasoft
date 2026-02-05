import TaskCard from "./TaskCard";
import type { Task } from "../../types/task";

interface Props {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const KanbanColumn = ({ title, status, tasks, onTaskClick }: Props) => {
  const filtered = tasks.filter((t) => t.status === status);

  return (
    <div className="col-md-3">
      <div className="card shadow-sm h-100">
        <div className="card-header bg-light fw-semibold d-flex justify-content-between">
          <span>{title}</span>
          <span className="badge bg-secondary">{filtered.length}</span>
        </div>

        <div className="card-body kanban-column">
          {filtered.length === 0 && (
            <p className="text-muted small text-center mt-3">No tasks</p>
          )}

          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
