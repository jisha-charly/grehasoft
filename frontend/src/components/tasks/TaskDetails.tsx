import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Task } from "../../types/task";
import TaskFiles from "./TaskFiles";

interface Props {
  // Accept Task plus optional description (defensive in case of type drift)
  task: Task & { description?: string };
  onClose: () => void;
}

const TaskDetails: React.FC<Props> = ({ task, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const modal = (
    <div className="modal-backdrop show task-details-backdrop" aria-hidden style={{ zIndex: 120000 }}>
      <div
        className="modal show d-block task-details-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
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
                <small className="text-dark me-3">Created: {task.created_at ? new Date(task.created_at).toLocaleString() : "-"}</small>
                <small className="text-dark">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}</small>
              </div>

              <div className="bg-white p-2 rounded">
                <p className="text-dark" style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>{task.description || "No description"}</p>
              </div>

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

  return createPortal(modal, document.body);
};

export default TaskDetails;
