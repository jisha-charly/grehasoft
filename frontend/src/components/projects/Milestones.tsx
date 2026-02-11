import { useEffect, useState } from "react";
import {
  getMilestones,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} from "../../api/services/milestone.service";

import type { Milestone } from "../../types/milestone";

const Milestones = ({ projectId }: { projectId: number }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editing, setEditing] = useState<Milestone | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Milestone | null>(null);

  const loadMilestones = async () => {
    const data = await getMilestones(projectId);
    setMilestones(data);
  };

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  /* CREATE */
  const create = async () => {
    if (!title || !dueDate) return;

    await addMilestone(projectId, {
      title,
      due_date: dueDate,
    });

    setTitle("");
    setDueDate("");
    loadMilestones();
  };

  /* UPDATE (status removed) */
  const saveEdit = async () => {
    if (!editing) return;

    await updateMilestone(editing.id, {
      title: editing.title,
      due_date: editing.due_date,
    });

    setEditing(null);
    loadMilestones();
  };

  /* DELETE */
  const confirmRemove = async () => {
    if (!confirmDelete) return;

    await deleteMilestone(confirmDelete.id);
    setConfirmDelete(null);
    loadMilestones();
  };

  return (
    <>
      <h5>Milestones</h5>

      {/* ADD FORM */}
      <div className="row g-2 align-items-end">
        <div className="col-md-5">
          <label className="form-label">Milestone Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="col-md-3 d-grid">
          <button className="btn btn-success" onClick={create}>
            Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Status</th>
            <th style={{ width: "180px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {milestones.map((m) => (
            <tr key={m.id}>
              <td>
                {editing?.id === m.id ? (
                  <input
                    className="form-control form-control-sm"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                  />
                ) : (
                  m.title
                )}
              </td>

              <td>
                {editing?.id === m.id ? (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={editing.due_date}
                    onChange={(e) =>
                      setEditing({ ...editing, due_date: e.target.value })
                    }
                  />
                ) : (
                  m.due_date
                )}
              </td>

              {/* AUTO STATUS DISPLAY ONLY */}
              <td>
                <span
                  className={`badge ${
                    m.status === "completed"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {m.status}
                </span>
              </td>

              <td>
                {editing?.id === m.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => setEditing(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setConfirmDelete(m)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {!milestones.length && (
            <tr>
              <td colSpan={4} className="text-center">
                No milestones
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DELETE MODAL */}
      {confirmDelete && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirm Delete</h5>
              </div>
              <div className="modal-body">
                Delete milestone <strong>{confirmDelete.title}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmRemove}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Milestones;
