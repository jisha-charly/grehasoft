import { useEffect, useState } from "react";
import api from "../../api/axios";

import type { TaskType } from "../../types/tasktypes";

const ITEMS_PER_PAGE = 5;

const TaskTypes = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editing, setEditing] = useState<TaskType | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // ---------- LOAD ----------
  const loadTaskTypes = async () => {
    const res = await api.get<TaskType[]>("task-types/");
    setTaskTypes(res.data);
  };

  useEffect(() => {
    loadTaskTypes();
  }, []);

  // ---------- CREATE ----------
  const createTaskType = async () => {
    if (!name.trim()) return;

    await api.post("task-types/create/", {
      name,
      description,
    });

    setName("");
    setDescription("");
    loadTaskTypes();
  };

  // ---------- UPDATE ----------
  const updateTaskType = async () => {
    if (!editing) return;

    await api.put(`task-types/${editing.id}/update/`, {
      name: editing.name,
      description: editing.description,
    });

    setEditing(null);
    loadTaskTypes();
  };

  // ---------- DELETE ----------
  const deleteTaskType = async () => {
    if (!deleteId) return;

    await api.delete(`task-types/${deleteId}/delete/`);
    setDeleteId(null);
    loadTaskTypes();
  };

  // ---------- SEARCH ----------
  const filtered = taskTypes.filter((t) =>
    `${t.name} ${t.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-3">
      <h3>Task Types</h3>

      {/* ---------- CREATE ---------- */}
      <div className="card mb-3">
        <div className="card-body d-flex gap-2 flex-wrap">
          <input
            className="form-control"
            placeholder="Task type name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn btn-primary" onClick={createTaskType}>
            Add
          </button>
        </div>
      </div>

      {/* ---------- SEARCH ---------- */}
      <input
        className="form-control mb-3"
        placeholder="Search task types..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ---------- TABLE ---------- */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created</th>
            <th style={{ width: 140 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.description || "-"}</td>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => setEditing(t)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteId(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {paginated.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-muted">
                No task types found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- PAGINATION ---------- */}
      {totalPages > 1 && (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            First
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
        </div>
      )}

      {/* ---------- EDIT MODAL ---------- */}
      {editing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Task Type</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updateTaskType}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- DELETE MODAL ---------- */}
      {deleteId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                Are you sure you want to delete this task type?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={deleteTaskType}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTypes;
