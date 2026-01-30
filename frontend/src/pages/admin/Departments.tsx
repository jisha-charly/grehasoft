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
  const [loading, setLoading] = useState(true);

  // create form (same pattern as Roles)
  const [form, setForm] = useState<{
    name: string;
    parent_id: number | null;
  }>({
    name: "",
    parent_id: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // search & pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // edit & delete
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleteDept, setDeleteDept] = useState<Department | null>(null);

  /* ================= FETCH ================= */
  const loadDepartments = async () => {
    setLoading(true);
    const data = await getDepartments();
    setDepartments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ================= VALIDATION (ROLES STYLE) ================= */
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

  /* ================= EDIT ================= */
  const openEdit = (dept: Department) => {
    setEditing(dept);
    setErrors({});
  };

  const handleUpdate = async () => {
    if (!editing) return;
    if (!validate(editing, editing.id)) return;

    await updateDepartment(editing.id, {
      name: editing.name.trim(),
      parent_id: editing.parent_id,
    });

    setEditing(null);
    loadDepartments();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteDept) return;
    await deleteDepartment(deleteDept.id);
    setDeleteDept(null);
    loadDepartments();
  };

  /* ================= SEARCH ================= */
  const filtered = departments.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.parent_name?.toLowerCase().includes(q) ?? false)
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
    <div className="container mt-4">
      <h3 className="mb-3">Departments</h3>

      {/* 🔍 SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search by department or parent..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ➕ CREATE FORM (IMPORTANT FIX) */}
      <div className="card mb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 🔑 forces validation render
            handleCreate();
          }}
        >
          <div className="card-body row g-2">
            <div className="col-md-4">
              <input
                className={`form-control ${
                  errors.name ? "is-invalid" : ""
                }`}
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

            <div className="col-md-4">
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

            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th style={{ width: 160 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No departments found
                </td>
              </tr>
            ) : (
              paginated.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.parent_name || "-"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteDept(d)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* 📄 PAGINATION */}
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

      {/* ✏️ EDIT MODAL */}
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
                <button
                  className="btn btn-success"
                  onClick={handleUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🗑 DELETE MODAL */}
      {deleteDept && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-body">
                Delete <b>{deleteDept.name}</b>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteDept(null)}
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
