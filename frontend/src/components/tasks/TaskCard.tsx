import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../../types/task";
import "../../css/kanban.css";

interface Props {
  task: Task;
  index: number;
}

/* Badge color mapping */
const statusClass: Record<Task["status"], string> = {
  todo: "status-todo",
  in_progress: "status-in_progress",
  done: "status-done",
  blocked: "status-blocked",
};

const TaskCard = ({ task, index }: Props) => {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="kanban-task-card"
        >
          {/* TITLE */}
          <h6 className="kanban-task-title">{task.title}</h6>

          {/* FOOTER */}
          <div className="kanban-task-footer">
            {task.task_type_name && (
              <span className="kanban-tag">
                {task.task_type_name}
              </span>
            )}

            <span className={`kanban-status ${statusClass[task.status]}`}>
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
