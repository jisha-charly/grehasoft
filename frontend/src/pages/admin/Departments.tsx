import { useEffect, useState } from "react";
import type { Department } from "../../types/department";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/services/department.service";

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [search, setSearch] = useState("");

  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteDeptId, setDeleteDeptId] = useState<number | null>(null);

  /* ---------------- LOAD ---------------- */
  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    if (!name.trim()) return;

    await createDepartment({
      name,
      parent_id: parentId || null,
    });

    setName("");
    setParentId("");
    loadDepartments();
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!editingDept) return;

    await updateDepartment(editingDept.id, {
      name: editingDept.name,
      parent_id: editingDept.parent_id,
    });

    setEditingDept(null);
    loadDepartments();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!deleteDeptId) return;

    await deleteDepartment(deleteDeptId);
    setDeleteDeptId(null);
    loadDepartments();
  };

  /* ---------------- SEARCH ---------------- */
  const filteredDepartments = departments.filter((d) =>
    `${d.name} ${d.parent_name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-3">
      <h3>Departments</h3>

      {/* CREATE */}
      <div className="card mb-3">
        <div className="card-body d-flex gap-2 flex-wrap">
          <input
            className="form-control"
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="form-select"
            value={parentId}
            onChange={(e) => setParentId(Number(e.target.value))}
          >
            <option value="">Main Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleCreate}>
            Add
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search departments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Created</th>
            <th style={{ width: 160 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.parent_name || "-"}</td>
              <td>{d.created_at
    ? new Date(d.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => setEditingDept(d)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteDeptId(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editingDept && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Department</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editingDept.name}
                  onChange={(e) =>
                    setEditingDept({ ...editingDept, name: e.target.value })
                  }
                />

                <select
                  className="form-select"
                  value={editingDept.parent_id ?? ""}
                  onChange={(e) =>
                    setEditingDept({
                      ...editingDept,
                      parent_id: Number(e.target.value) || null,
                    })
                  }
                >
                  <option value="">Main Department</option>
                  {departments
                    .filter((d) => d.id !== editingDept.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingDept(null)}
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
      {deleteDeptId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                Are you sure you want to delete this department?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteDeptId(null)}
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

export default Departments;
