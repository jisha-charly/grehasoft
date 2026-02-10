import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../../types/task";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import "../../css/kanban.css";

interface Props {
  task: Task;
  index: number;
  onClick?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

const statusClass: Record<Task["status"], string> = {
  todo: "status-todo",
  in_progress: "status-in_progress",
  done: "status-done",
  blocked: "status-blocked",
};

const TaskCard = ({ task, index, onClick, onDelete }: Props) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="kanban-task-card"
            onClick={() => onClick?.(task)}
          >
            {/* HEADER */}
            <div className="kanban-task-header">
              <h6 className="kanban-task-title">{task.title}</h6>

              <button
                className="kanban-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDelete(true);
                }}
                title="Delete task"
              >
                🗑️
              </button>
            </div>

            {/* FOOTER */}
            <div className="kanban-task-footer">
              {task.task_type_name && (
                <span className="kanban-tag">{task.task_type_name}</span>
              )}

              <span className={`kanban-status ${statusClass[task.status]}`}>
                {task.status.replace("_", " ")}
              </span>
            </div>
          </div>
        )}
      </Draggable>

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        show={showDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          onDelete?.(task.id);
        }}
      />
    </>
  );
};

export default TaskCard;
