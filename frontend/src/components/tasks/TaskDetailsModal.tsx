import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import type { ProjectMember } from "../../types/projectMember";
import {
  updateTaskStatus,
  assignTask,
} from "../../api/services/task.service";
import { getMembers } from "../../api/services/projectMember.service";
import {
  addTaskProgress,
  getTaskProgress,
} from "../../api/services/taskProgress.service";

interface TaskProgress {
  id: number;
  progress: number;
  note: string;
  created_at: string;
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

  /* ===============================
     Task Progress
  =============================== */
  const [progressList, setProgressList] = useState<TaskProgress[]>([]);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [progressNote, setProgressNote] = useState("");

  /* ===============================
     Load project members
  =============================== */
  useEffect(() => {
    if (!task.project) return;

    const loadMembers = async () => {
      try {
        const data = await getMembers(task.project);
        setMembers(data);
      } catch (err) {
        console.error("Failed to load project members", err);
      }
    };

    loadMembers();
  }, [task.project]);

  /* ===============================
     Load task progress
  =============================== */
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getTaskProgress(task.id);
        setProgressList(data);
      } catch (err) {
        console.error("Failed to load task progress", err);
      }
    };

    loadProgress();
  }, [task.id]);

  /* ===============================
     Save handler
  =============================== */
  const handleSave = async () => {
    try {
      setSaving(true);

      // 1️⃣ Update status
      if (form.status !== task.status) {
        await updateTaskStatus(task.id, form.status);
      }

      // 2️⃣ Save assignment
      const updatedTask = await assignTask(
        task.id,
        assignedEmployeeId === "" ? null : assignedEmployeeId
      );

      onSave(updatedTask);
      onClose();
    } catch (err) {
      console.error("Failed to save task", err);
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     Add progress
  =============================== */
  const handleAddProgress = async () => {
    if (!progressNote.trim()) return;

    try {
      const newProgress = await addTaskProgress(task.id, {
        progress: progressValue,
        note: progressNote,
      });

      setProgressList([newProgress, ...progressList]);
      setProgressValue(0);
      setProgressNote("");
    } catch (err) {
      console.error("Failed to add progress", err);
    }
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4">
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Task Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
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

            <div className="row">
              {/* STATUS */}
              <div className="col-md-4">
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

              {/* PRIORITY */}
              <div className="col-md-4">
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

              {/* TASK TYPE */}
              <div className="col-md-4">
                <label className="form-label fw-bold">Task Type</label>
                <input
                  className="form-control"
                  value={form.task_type_name || "-"}
                  disabled
                />
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
                    e.target.value === "" ? "" : Number(e.target.value)
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

            {/* TASK PROGRESS */}
            <hr />
            <h6 className="fw-bold">Task Progress</h6>

            <div className="row mb-2">
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="%"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                />
              </div>
              <div className="col-md-7">
                <input
                  className="form-control"
                  placeholder="Progress note"
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                />
              </div>
              <div className="col-md-2">
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

            {progressList.map((p) => (
              <div
                key={p.id}
                className="border rounded p-2 mb-2 small"
              >
                <strong>{p.progress}%</strong> — {p.note}
                <div className="text-muted">
                  {new Date(p.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
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
