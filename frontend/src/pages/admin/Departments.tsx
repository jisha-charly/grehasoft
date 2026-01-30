import { useEffect, useState } from "react";
import type { Department } from "../../types/department";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/services/department.service";

const ITEMS_PER_PAGE = 5;

const Departments = () => {
  /* ================= STATE ================= */
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState<{ name: string; parent_id: number | null }>({
    name: "",
    parent_id: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ================= LOAD ================= */
  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ================= VALIDATION (CLIENTS STYLE) ================= */
  const validate = (
    data: { name?: string },
    currentId?: number
  ) => {
    const e: Record<string, string> = {};
    const name = data.name?.trim() || "";

    if (!name) {
      e.name = "Department name is required";
    } else if (name.length < 3) {
      e.name = "Department name must be at least 3 characters";
    } else if (
      departments.some(
        (d) =>
          d.name.toLowerCase() === name.toLowerCase() &&
          d.id !== currentId
      )
    ) {
      e.name = "Department already exists";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!validate(form)) return;

    await createDepartment({
      name: form.name.trim(),
      parent_id: form.parent_id,
    });

    setForm({ name: "", parent_id: null });
    setErrors({});
    loadDepartments();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editing) return;
    if (!validate(editing, editing.id)) return;

    await updateDepartment(editing.id, {
      name: editing.name.trim(),
      parent_id: editing.parent_id,
    });

    setEditing(null);
    setErrors({});
    loadDepartments();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDepartment(deleteId);
    setDeleteId(null);
    loadDepartments();
  };

  /* ================= SEARCH ================= */
  const filtered = departments.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.parent_name ?? "").toLowerCase().includes(q) ||
      (d.created_at ?? "").toLowerCase().includes(q)
    );
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= UI ================= */
  return (
    <div className="container mt-3">
      <h3>Departments</h3>

      {/* CREATE */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          <div className="col-md-5">
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Department name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="col-md-5">
            <select
              className="form-select"
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  parent_id: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
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
            <button className="btn btn-primary" onClick={handleCreate}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search departments..."
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
            <th>Parent</th>
            <th>Created</th>
            <th style={{ width: 140 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.parent_name || "-"}</td>
              <td>{d.created_at}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditing(d);
                    setErrors({});
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteId(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!paginated.length && (
            <tr>
              <td colSpan={4} className="text-center">
                No departments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <input
                  className={`form-control ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  value={editing.name}
                  onChange={(e) => {
                    setEditing({
                      ...editing,
                      name: e.target.value,
                    });
                    setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">
                    {errors.name}
                  </div>
                )}
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
                Delete this department?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteId(null)}
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
