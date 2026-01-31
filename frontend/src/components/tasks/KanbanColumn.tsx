import TaskCard from "./TaskCard";
import type { Task } from "../../types/task";

interface Props {
  title: string;
  status: Task["status"];
  tasks: Task[];
}

const KanbanColumn = ({ title, status, tasks }: Props) => {
  const columnTasks = tasks.filter(t => t.status === status);

  return (
    <div className="col-md-3">
      <div className="card shadow-sm h-100">
        {/* Column Header */}
        <div className="card-header bg-light fw-semibold text-center">
          {title}
          <span className="badge bg-secondary ms-2">
            {columnTasks.length}
          </span>
        </div>

        {/* Column Body */}
        <div
          className="card-body"
          style={{
            minHeight: "300px",
            background: "#f8f9fa",
          }}
        >
          {columnTasks.length === 0 && (
            <p className="text-muted small text-center mt-3">
              No tasks
            </p>
          )}

          {columnTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
