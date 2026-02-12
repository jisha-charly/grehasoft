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
import {
  getTaskComments,
  addTaskComment,
  TaskComment,
} from "../../api/services/taskComment.service";
import {
  ActivityLog,
  getTaskActivity,
} from "../../api/services/activity.service";

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

  const [activeTab, setActiveTab] = useState<
    "details" | "progress" | "files" | "comments" | "activity"
  >("details");

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<number | "">(
    task.assignment?.employee ?? ""
  );

  const [progressList, setProgressList] = useState<TaskProgress[]>([]);
  const [progressNote, setProgressNote] = useState("");

  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  /* ===============================
     LOADERS
  =============================== */

  useEffect(() => {
    setForm({ ...task });
    setAssignedEmployeeId(task.assignment?.employee ?? "");
  }, [task]);

  useEffect(() => {
    if (!task.project) return;
    getMembers(task.project).then(setMembers);
  }, [task.project]);

  useEffect(() => {
    getTaskProgress(task.id).then(setProgressList);
  }, [task.id]);

  useEffect(() => {
    getTaskComments(task.id).then(setComments);
  }, [task.id]);

  useEffect(() => {
    if (activeTab === "activity") {
      loadActivity();
    }
  }, [activeTab, task.id]);

  const loadActivity = async () => {
    try {
      const data = await getTaskActivity(task.id);
      setActivityLogs(data);
    } catch (err) {
      console.error("Failed to load activity logs", err);
    }
  };

  /* ===============================
     ACTIONS
  =============================== */

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const created = await addTaskComment(task.id, {
      comment: newComment,
    });

    setComments([created, ...comments]);
    setNewComment("");
  };

  const handleAddProgress = async () => {
    if (!progressNote.trim()) return;

    const newProgress = await addTaskProgress(task.id, {
      status: form.status,
      comment: progressNote,
    });

    setProgressList([newProgress, ...progressList]);
    setProgressNote("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updatedTask = await updateTask(task.id, {
        title: form.title,
        description: form.description || "",
        status: form.status,
        priority: form.priority,
      });

      const originalAssigned = task.assignment?.employee ?? "";

      if (assignedEmployeeId !== originalAssigned) {
        await assignTask(
          task.id,
          assignedEmployeeId === "" ? null : assignedEmployeeId
        );
      }

      const refreshedTask = {
        ...updatedTask,
        assignment:
          assignedEmployeeId === ""
            ? null
            : { employee: assignedEmployeeId },
      };

      onSave(refreshedTask);
      onClose();
    } catch {
      alert("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Task Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* TAB NAV */}
            <ul className="nav nav-tabs mb-3">
              {[
                { key: "details", label: "Details" },
                { key: "progress", label: "Progress" },
                { key: "files", label: "Files" },
                { key: "comments", label: "Comments" },
                { key: "activity", label: "Activity" },
              ].map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <button
                    className={`nav-link ${
                      activeTab === tab.key ? "active" : ""
                    }`}
                    onClick={() =>
                      setActiveTab(tab.key as typeof activeTab)
                    }
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ maxHeight: "400px", overflowY: "auto" }}>

              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <>
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
                </>
              )}

              {/* PROGRESS TAB */}
              {activeTab === "progress" && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-8">
                      <input
                        className="form-control"
                        placeholder="Progress note"
                        value={progressNote}
                        onChange={(e) => setProgressNote(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={handleAddProgress}
                      >
                        Add Progress
                      </button>
                    </div>
                  </div>

                  {progressList.length === 0 && (
                    <p className="text-muted">No progress added yet.</p>
                  )}

                  {progressList.map((p) => (
                    <div key={p.id} className="border rounded p-2 mb-2 small">
                      <strong>{p.status.replace("_", " ")}</strong>
                      {p.comment && <> — {p.comment}</>}
                      <div className="text-muted">
                        {new Date(p.updated_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* COMMENTS TAB */}
              {activeTab === "comments" && (
                <>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleAddComment}
                  >
                    Add Comment
                  </button>

                  <div className="mt-3">
                    {comments.map((c) => (
                      <div key={c.id} className="border rounded p-2 mb-2">
                        <strong>{c.username}</strong>
                        <div>{c.comment}</div>
                        <small className="text-muted">
                          {new Date(c.created_at).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* FILES TAB */}
              {activeTab === "files" && (
                <div className="text-muted">
                  File uploads coming soon...
                </div>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === "activity" && (
                <>
                  {activityLogs.length === 0 && (
                    <div className="text-muted">No activity yet.</div>
                  )}

                  {activityLogs.map((log) => (
                    <div key={log.id} className="border rounded p-2 mb-2">
                      <strong>{log.user_name || "System"}</strong> —{" "}
                      {log.action}
                      {log.description && <div>{log.description}</div>}
                      <small className="text-muted d-block">
                        {new Date(log.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </>
              )}
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
