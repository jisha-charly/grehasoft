import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import type { ProjectMember } from "../../types/projectMember";
import {
  updateTask,
  assignTask,
} from "../../api/services/task.service";
import { getMembers } from "../../api/services/projectMember.service";
import {
  addTaskProgress,
  getTaskProgress,
} from "../../api/services/taskProgress.service";

interface TaskProgress {
  id: number;
  status: "todo" | "in_progress" | "done" | "blocked";
  comment: string;
  updated_at: string;
}

interface Props {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskDetailsModal = ({ task, onClose, onSave }: Props) => {
  const [form, setForm] = useState<Task>({ ...task });
  const [saving, setSaving] = useState(false);

  /* ===============================
     Project members
  =============================== */
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<number | "">(
    task.assignment?.employee ?? ""
  );

  /* Sync when task changes */
  useEffect(() => {
    setForm({ ...task });
    setAssignedEmployeeId(task.assignment?.employee ?? "");
  }, [task]);

  /* ===============================
     Task Progress
  =============================== */
  const [progressList, setProgressList] = useState<TaskProgress[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [progressNote, setProgressNote] = useState("");

  /* Load members */
  useEffect(() => {
    if (!task.project) return;

    getMembers(task.project)
      .then(setMembers)
      .catch(() => console.error("Failed to load members"));
  }, [task.project]);

  /* Load progress */
  useEffect(() => {
    getTaskProgress(task.id)
      .then(setProgressList)
      .catch(() => console.error("Failed to load progress"));
  }, [task.id]);

  /* ===============================
     SAVE TASK (Assignment Fixed)
  =============================== */
  const handleSave = async () => {
    try {
      setSaving(true);

      // 1️⃣ Update task basic fields
      const updatedTask = await updateTask(task.id, {
        title: form.title,
        description: form.description || "",
        status: form.status,
        priority: form.priority,
      });

      // 2️⃣ Handle assignment
      const originalAssigned = task.assignment?.employee ?? "";

      if (assignedEmployeeId !== originalAssigned) {
        await assignTask(
          task.id,
          assignedEmployeeId === "" ? null : assignedEmployeeId
        );
      }

      // 3️⃣ Refresh full task from backend (important!)
      const refreshedTask = {
        ...updatedTask,
        assignment:
          assignedEmployeeId === ""
            ? null
            : {
                employee: assignedEmployeeId,
              },
      };

      onSave(refreshedTask);
      onClose();
    } catch (error) {
      console.error("Failed to save task", error);
      alert("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     ADD PROGRESS
  =============================== */
  const handleAddProgress = async () => {
    if (!progressNote.trim()) return;

    try {
      const newProgress = await addTaskProgress(task.id, {
        status: form.status,
        comment: progressNote,
      });

      setProgressList([newProgress, ...progressList]);
      setProgressValue(0);
      setProgressNote("");
    } catch (err) {
      console.error("Failed to add progress", err);
      alert("Failed to add progress");
    }
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Task Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* TITLE */}
            <div className="mb-3">
              <label className="form-label fw-bold">Title</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* STATUS + PRIORITY */}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label fw-bold">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as Task["status"],
                    })
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Priority</label>
                <select
                  className="form-select"
                  value={form.priority || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as Task["priority"],
                    })
                  }
                >
                  <option value="">-</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* ASSIGNED TO */}
            <div className="mt-3">
              <label className="form-label fw-bold">Assigned To</label>
              <select
                className="form-select"
                value={assignedEmployeeId}
                onChange={(e) =>
                  setAssignedEmployeeId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.user}>
                    {m.username}
                  </option>
                ))}
              </select>
            </div>

            {/* PROGRESS */}
            <hr />
            <h6 className="fw-bold">Task Progress</h6>

            <div className="row mb-2">
              <div className="col-md-7">
                <input
                  className="form-control"
                  placeholder="Progress note"
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                />
              </div>
              <div className="col-md-5">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={handleAddProgress}
                >
                  Add
                </button>
              </div>
            </div>

            {progressList.length === 0 && (
              <p className="text-muted">No progress added yet.</p>
            )}

            <div
  style={{
    maxHeight: "300px",
    overflowY: "auto",
  }}
>
  {progressList.length === 0 && (
    <p className="text-muted">No progress added yet.</p>
  )}

  {progressList.map((p) => (
    <div
      key={p.id}
      className="border rounded p-2 mb-2 small"
    >
      <strong>{p.status.replace("_", " ")}</strong>
      {p.comment && <> — {p.comment}</>}
      <div className="text-muted">
        {new Date(p.updated_at).toLocaleString()}
      </div>
    </div>
  ))}
</div>

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
