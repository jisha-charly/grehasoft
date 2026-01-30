import { useEffect, useState } from "react";
import type { Department } from "../../types/department";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/services/department.service";

const Departments = () => {
  /* ================= STATE ================= */
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [search, setSearch] = useState("");

  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteDeptId, setDeleteDeptId] = useState<number | null>(null);

  /* ✅ SIMPLE ERROR STATES (NO UTILS) */
  const [nameError, setNameError] = useState("");

  /* ================= LOAD ================= */
  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ================= VALIDATION (BULLETPROOF) ================= */
  const validateName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "Department name is required";
    if (trimmed.length < 3)
      return "Department name must be at least 3 characters";

    const exists = departments.some(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) return "Department already exists";

    return "";
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    const error = validateName(name);
    setNameError(error);

    if (error) return;

    await createDepartment({
      name: name.trim(),
      parent_id: parentId || null,
    });

    setName("");
    setParentId("");
    setNameError("");
    loadDepartments();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteDeptId) return;
    await deleteDepartment(deleteDeptId);
    setDeleteDeptId(null);
    loadDepartments();
  };

  /* ================= SEARCH (ALL FIELDS) ================= */
  const filteredDepartments = departments.filter((d) => {
    const t = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(t) ||
      (d.parent_name ?? "").toLowerCase().includes(t) ||
      (d.created_at ?? "").toLowerCase().includes(t)
    );
  });

  /* ================= UI ================= */
  return (
    <div className="container mt-3">
      <h3>Departments</h3>

      {/* CREATE */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className={`form-control ${
                  nameError ? "is-invalid" : ""
                }`}
                placeholder="Department name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
                onBlur={(e) =>
                  setNameError(validateName(e.target.value))
                }
              />

              {nameError && (
                <div className="invalid-feedback d-block">
                  {nameError}
                </div>
              )}
            </div>

            <div className="col-md-5">
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
            </div>

            <div className="col-md-2 d-grid">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!!nameError}
                onClick={handleCreate}
              >
                Add
              </button>
            </div>
          </div>
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
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.parent_name || "-"}</td>
              <td>{d.created_at || "-"}</td>
              <td>
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

      {/* DELETE MODAL */}
      {deleteDeptId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                Are you sure you want to delete?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteDeptId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
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
