import { useEffect, useState } from "react";
import type { Role } from "../../types/role";
import {
  getRoles,
  createRole,
  deleteRole,
} from "../../api/services/role.service";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  /* ---------------- LOAD ---------------- */
  const loadRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    try {
      await createRole({ name, description });
      setName("");
      setDescription("");
      loadRoles();
      showToast("Role created successfully", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Failed to create role",
        "danger"
      );
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      loadRoles();
      showToast("Role deleted successfully", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Something went wrong",
        "danger"
      );
    }
  };

  /* ---------------- SEARCH ---------------- */
  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- TOAST ---------------- */
  const showToast = (message: string, type: "success" | "danger") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">User Roles</h5>
        </div>

        <div className="card-body">
          {/* SEARCH */}
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CREATE */}
          <div className="row g-2 mb-4">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Role name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-primary" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>

          {/* TABLE */}
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Role</th>
                <th>Description</th>
                <th style={{ width: 120 }}>Action</th>
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
                filteredRoles.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.description}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className={`toast show position-fixed bottom-0 end-0 m-3 text-white bg-${toast.type}`}
          style={{ zIndex: 1055 }}
        >
          <div className="toast-body">{toast.message}</div>
        </div>
      )}
    </div>
  );
};

export default Roles;
