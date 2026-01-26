import { useEffect, useState } from "react";
import {
  getMilestones,
  addMilestone,
  deleteMilestone,
  updateMilestone,
} from "../../api/projects";

const Milestones = ({ projectId }: { projectId: number }) => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const res = await getMilestones(projectId);
    setMilestones(res.data);
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const create = async () => {
    if (!title || !dueDate) return alert("All fields required");
    await addMilestone(projectId, { title, due_date: dueDate });
    setTitle("");
    setDueDate("");
    load();
  };

  const remove = async (id: number) => {
    await deleteMilestone(id);
    load();
  };

  const saveEdit = async () => {
    await updateMilestone(editing.id, {
      title: editing.title,
      due_date: editing.due_date,
      status: editing.status,
    });
    setEditing(null);
    load();
  };

  return (
    <>
      <h5>Milestones</h5>

      {/* CREATE */}
      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={create}>
            Add
          </button>
        </div>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Status</th>
            <th style={{ width: "140px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((m) => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.due_date}</td>
              <td>
                <span
                  className={`badge bg-${
                    m.status === "completed" ? "success" : "secondary"
                  }`}
                >
                  {m.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => setEditing(m)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(m.id)}
                >
                  Delete
                </button>
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

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Milestone</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={editing.due_date}
                  onChange={(e) =>
                    setEditing({ ...editing, due_date: e.target.value })
                  }
                />
                <select
                  className="form-select"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={saveEdit}>
                  Save
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
