import { useEffect, useState } from "react";
import {
  getMilestones,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} from "../../api/projects";

const Milestones = ({ projectId }: { projectId: number }) => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const load = async () => {
    const res = await getMilestones(projectId);
    setMilestones(res.data);
  };

  useEffect(() => {
    load();
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
    load();
  };

  /* UPDATE */
  const saveEdit = async () => {
    await updateMilestone(editing.id, {
      title: editing.title,
      due_date: editing.due_date,
      status: editing.status,
    });

    setEditing(null);
    load();
  };

  /* DELETE */
  const confirmRemove = async () => {
    if (!confirmDelete) return;
    await deleteMilestone(confirmDelete.id);
    setConfirmDelete(null);
    load();
  };

  return (
    <>
      <h5>Milestones</h5>

      {/* ADD FORM */}
      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Milestone title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={create}>
            Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Status</th>
            <th style={{ width: "180px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {milestones.map(m => (
            <tr key={m.id}>
              <td>
                {editing?.id === m.id ? (
                  <input
                    className="form-control form-control-sm"
                    value={editing.title}
                    onChange={e =>
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
                    onChange={e =>
                      setEditing({ ...editing, due_date: e.target.value })
                    }
                  />
                ) : (
                  m.due_date
                )}
              </td>

              <td>
                {editing?.id === m.id ? (
                  <select
                    className="form-select form-select-sm"
                    value={editing.status}
                    onChange={e =>
                      setEditing({ ...editing, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <span
                    className={`badge bg-${
                      m.status === "completed"
                        ? "success"
                        : "secondary"
                    }`}
                  >
                    {m.status}
                  </span>
                )}
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

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>

              <div className="modal-body">
                Delete milestone{" "}
                <strong>{confirmDelete.title}</strong>?
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmRemove}
                >
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
