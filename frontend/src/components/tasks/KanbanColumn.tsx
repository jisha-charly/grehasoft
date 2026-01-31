import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../../types/task";

interface Props {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

const KanbanColumn = ({ title, status, tasks }: Props) => {
  const filtered = tasks.filter(t => t.status === status);

  return (
    <div className="col-md-3">
      <div className="bg-light rounded p-3 h-100">
        <h6 className="fw-bold text-center mb-3">{title}</h6>

        {filtered.length === 0 && (
          <p className="text-muted small text-center">No tasks</p>
        )}

        {filtered.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
