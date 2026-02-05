import { useEffect, useState } from "react";
import {
  getTaskTypes,
  createTaskType,
  updateTaskType,
  deleteTaskType,
} from "../../api/services/taskType.service";

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

  /* ---------- LOAD ---------- */
  const loadTaskTypes = async () => {
    const data = await getTaskTypes();
    setTaskTypes(data);
  };

  useEffect(() => {
    loadTaskTypes();
  }, []);

  /* ---------- CREATE ---------- */
  const handleCreate = async () => {
    if (!name.trim()) return;

    await createTaskType({ name, description });
    setName("");
    setDescription("");
    loadTaskTypes();
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async () => {
    if (!editing) return;

    await updateTaskType(editing.id, {
      name: editing.name,
      description: editing.description,
    });

    setEditing(null);
    loadTaskTypes();
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteTaskType(deleteId);
    setDeleteId(null);
    loadTaskTypes();
  };

  /* ---------- FILTER ---------- */
  const filtered = taskTypes.filter((t) =>
    `${t.name} ${t.description ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-3">
      <h3>Task Types</h3>

      {/* CREATE */}
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
          <button className="btn btn-primary" onClick={handleCreate}>
            Add
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search task types..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}
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
              <td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}</td>
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

          {!paginated.length && (
            <tr>
              <td colSpan={4} className="text-center text-muted">
                No task types found
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
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
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
                <button className="btn btn-danger" onClick={handleDelete}>
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
