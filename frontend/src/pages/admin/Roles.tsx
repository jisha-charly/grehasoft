import { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  deleteRole,
  updateRole,
} from "../../api/services/role.service";
import type { Role } from "../../types/role";

/* ================= VALIDATORS ================= */
const roleValidators = {
  name: /^[A-Za-z ]{3,}$/,
};

const Roles = () => {
  /* ================= STATE ================= */
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // create
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // search
  const [search, setSearch] = useState("");

  // edit modal
  const [editing, setEditing] = useState<Role | null>(null);

  // delete modal
  const [deleteRoleData, setDeleteRoleData] = useState<Role | null>(null);

  /* ================= FETCH ================= */
  const loadRoles = async () => {
    setLoading(true);
    const data = await getRoles();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = (data: { name: string; description?: string }) => {
    const e: Record<string, string> = {};

    if (!roleValidators.name.test(data.name.trim())) {
      e.name = "Role name must be at least 3 letters";
    }

    if (data.description && data.description.length < 3) {
      e.description = "Description must be at least 3 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!validate(form)) return;

    await createRole(form);
    setForm({ name: "", description: "" });
    setErrors({});
    loadRoles();
  };

  /* ================= EDIT ================= */
  const openEdit = (role: Role) => {
    setEditing(role);
    setErrors({});
  };

  const handleUpdate = async () => {
    if (!editing) return;
    if (!validate(editing)) return;

    await updateRole(editing.id, {
      name: editing.name,
      description: editing.description,
    });

    setEditing(null);
    loadRoles();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteRoleData) return;
    await deleteRole(deleteRoleData.id);
    setDeleteRoleData(null);
    loadRoles();
  };

  /* ================= UNIVERSAL SEARCH ================= */
  const filteredRoles = roles.filter((role) => {
    const q = search.toLowerCase();
    return (
      role.name.toLowerCase().includes(q) ||
      (role.description?.toLowerCase().includes(q) ?? false)
    );
  });

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <h3 className="mb-3">User Roles</h3>

      {/* 🔍 UNIVERSAL SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search by role name or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ CREATE FORM */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          <div className="col-md-4">
            <input
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Role name"
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

          <div className="col-md-6">
            <input
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              placeholder="Description"
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Role</th>
              <th>Description</th>
              <th style={{ width: 180 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No roles found
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.description}</td>
                  <td>
                    {role.name === "ADMIN" ? (
                      <>
                        <button className="btn btn-warning btn-sm me-2" disabled>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" disabled>
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => openEdit(role)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteRoleData(role)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Role</h5>
              </div>
              <div className="modal-body">
                <input
                  className={`form-control mb-2 ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  value={editing.name}
                  onChange={(e) => {
                    setEditing({ ...editing, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">
                    {errors.name}
                  </div>
                )}

                <input
                  className="form-control mt-2"
                  value={editing.description || ""}
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

      {/* 🗑 DELETE MODAL */}
      {deleteRoleData && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-body">
                Delete role <b>{deleteRoleData.name}</b>?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteRoleData(null)}
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

export default Roles;
