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

import {
  getTaskFiles,
  uploadTaskFile,
  reviewTaskFile,
  TaskFile,
  deleteTaskFile,
} from "../../api/services/taskFile.service";

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

  /* FILE STATES */
  const [files, setFiles] = useState<TaskFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [reviewComment, setReviewComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"approved" | "rework">(
    "approved"
  );

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

  useEffect(() => {
    if (activeTab === "files") {
      loadFiles();
    }
  }, [activeTab, task.id]);

  const loadActivity = async () => {
    const data = await getTaskActivity(task.id);
    setActivityLogs(data);
  };

  const loadFiles = async () => {
    const data = await getTaskFiles(task.id);
    setFiles(data);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadTaskFile(task.id, selectedFile);
    setSelectedFile(null);
    loadFiles();
  };

  const handleReview = async (fileId: number) => {
  if (!reviewComment.trim()) return;

  try {
    await reviewTaskFile(fileId, {
      comments: reviewComment,
      status: reviewStatus,
    });

    setReviewComment("");
    loadFiles();
  } catch (error: any) {
    alert(
      error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      "Review failed."
    );
  }
};


  const handleDelete = async (fileId: number) => {
    await deleteTaskFile(fileId);
    loadFiles();
  };

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

    onSave(updatedTask);
    onClose();
    setSaving(false);
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
                <>
                  <div className="row mb-3">
                    <div className="col-md-8">
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  {files.length === 0 && (
                    <div className="text-muted">No files uploaded yet.</div>
                  )}

                  {files.map((file) => {
                    const latestReview =
                      file.reviews?.[file.reviews.length - 1];

                    const status = latestReview
                      ? latestReview.status
                      : "pending";

                    return (
                      <div
                        key={file.id}
                        className="border rounded p-3 mb-3"
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>Revision {file.revision_no}</strong>
                            <div className="small text-muted">
                              Uploaded by {file.uploaded_by_name}
                            </div>
                          </div>

                          <span
                            className={`badge ${
                              status === "approved"
                                ? "bg-success"
                                : status === "rework"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-2">
                          <a
  href={`http://localhost:8000${file.file}`}
  target="_blank"
  rel="noreferrer"
>
  View File
</a>

                        </div>
                        {/* 🔥 REVIEW HISTORY */}
                        {file.reviews && file.reviews.length > 0 && (
                          <div className="mt-3">
                            <strong>Review History</strong>

                            {file.reviews.map((review) => (
                              <div
                                key={review.id}
                                className="border rounded p-2 mt-2 bg-light small"
                              >
                                <div className="fw-bold">
                                  {review.reviewer_name} (
                                  {review.reviewed_by_role})
                                </div>

                                <div
                                  className={`fw-semibold ${
                                    review.status === "approved"
                                      ? "text-success"
                                      : "text-danger"
                                  }`}
                                >
                                  {review.status.toUpperCase()}
                                </div>

                                <div>{review.comments}</div>

                                <div className="text-muted">
                                  {new Date(
                                    review.reviewed_at
                                  ).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        
                        <div className="mt-3">
                          <textarea
                            className="form-control mb-2"
                            placeholder="Review comment..."
                            value={reviewComment}
                            onChange={(e) =>
                              setReviewComment(e.target.value)
                            }
                          />

                          <select
                            className="form-select mb-2"
                            value={reviewStatus}
                            onChange={(e) =>
                              setReviewStatus(
                                e.target.value as "approved" | "rework"
                              )
                            }
                          >
                            <option value="approved">Approve</option>
                            <option value="rework">Rework</option>
                           

                          </select>
                         
 
  <div className="d-flex justify-content gap-2 mt-2">

  <button
    className="btn btn-danger btn-sm"
    onClick={() => handleDelete(file.id)}
  >
    Delete
  </button>

  <button
    className={`btn btn-primary ${
      status === "approved"
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
    disabled={status === "approved"}
    onClick={() => handleReview(file.id)}
  >
    Submit Review
  </button>

  {status === "approved" && (
    <div className="text-success small justify-content mt-2">
      ✅ This file has already been approved and is locked.
    </div>
  )}

</div>


                        </div>
                      </div>
                    );
                  })}
                </>
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
