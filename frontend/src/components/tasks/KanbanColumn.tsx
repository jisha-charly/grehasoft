import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task } from "../../types/task";
import "../../css/kanban.css";

interface Props {
  title: string;
  status: Task["status"];
  tasks: Task[];
}

const KanbanColumn = ({ title, status, tasks }: Props) => {
  const filtered = tasks.filter((t) => t.status === status);

  return (
    <div className="col-md-3 kanban-column-wrapper">
      <div className="kanban-column-card">
        {/* COLUMN HEADER */}
        <div className="kanban-column-header">
          <span>{title}</span>
          <span className="kanban-count">{filtered.length}</span>
        </div>

        {/* DROPPABLE AREA */}
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="kanban-column"
            >
              {filtered.length === 0 && (
                <p className="kanban-empty">No tasks</p>
              )}

              {filtered.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                />
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default KanbanColumn;
