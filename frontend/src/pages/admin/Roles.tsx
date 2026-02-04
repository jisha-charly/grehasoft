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
  <div className="admin-page">
    <div className="admin-card">
      <h1 className="admin-title">User Roles</h1>

      {/* 🔍 SEARCH */}
      <input
        className="admin-input"
        placeholder="Search by role name or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* ➕ CREATE ROLE */}
      <div
        className="admin-card"
        style={{ boxShadow: "none", padding: 0, marginBottom: 24 }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 2 }}>
            <input
              className="admin-input"
              placeholder="Role name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <small style={{ color: "#ef4444" }}>{errors.name}</small>
            )}
          </div>

          <div style={{ flex: 3 }}>
            <input
              className="admin-input"
              placeholder="Description"
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
            />
            {errors.description && (
              <small style={{ color: "#ef4444" }}>{errors.description}</small>
            )}
          </div>

          <button className="btn-primary" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>

      {/* 📋 ROLES TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Description</th>
                <th style={{ width: 180 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
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
                          <button className="btn-edit" disabled>
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            disabled
                            style={{ marginLeft: 8, opacity: 0.6 }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(role)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            style={{ marginLeft: 8 }}
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
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
{editing && (
  <div className="modal show d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-4 shadow">
        
        {/* HEADER */}
        <div className="modal-header border-0">
          <h5 className="modal-title">Edit Role</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setEditing(null)}
          />
        </div>

        {/* BODY */}
        <div className="modal-body">
          {/* Role Name */}
          <div className="mb-3">
            <label className="form-label">Role Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.name ? "is-invalid" : ""
              }`}
              value={editing.name}
              onChange={(e) => {
                setEditing({ ...editing, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer border-0">
          <button
            type="button"   // ✅ IMPORTANT FIX
            className="btn btn-outline-secondary"
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  </div>
)}


{deleteRoleData && (
  <div className="modal show d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-dialog-centered modal-sm">
      <div className="modal-content">
        <div className="modal-body">
          Delete role <b>{deleteRoleData.name}</b>?
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setDeleteRoleData(null)}
          >
            Cancel
          </button>
          <button
            type="button"
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
  </div>
);

};

export default Roles;
