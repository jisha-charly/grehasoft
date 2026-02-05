import React from "react";
import type { Task } from "../../types/task";
import TaskFiles from "./TaskFiles";

interface Props {
  // Accept Task plus optional description (defensive in case of type drift)
  task: Task & { description?: string };
  onClose: () => void;
}

const TaskDetails: React.FC<Props> = ({ task, onClose }) => {
  return (
    <div className="modal-backdrop show" style={{ zIndex: 1000 }}>
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1001 }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{task.title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <small className="text-muted me-3">Created: {task.created_at ? new Date(task.created_at).toLocaleString() : "-"}</small>
                <small className="text-muted">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}</small>
              </div>

              <p>{task.description || "No description"}</p>

              <hr />

              <h6>Files</h6>
              <TaskFiles taskId={task.id} />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
