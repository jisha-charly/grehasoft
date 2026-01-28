import { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../api/services/role.service";
import type { Role } from "../../types/role";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Edit popup state
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Load roles
  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Create role
  const handleCreate = async () => {
    if (!name.trim()) return;
    await createRole({ name, description });
    setName("");
    setDescription("");
    fetchRoles();
  };

  // Update role
  const handleUpdate = async () => {
    if (!editingRole) return;

    await updateRole(editingRole.id, {
      name,
      description,
    });

    setEditingRole(null);
    setName("");
    setDescription("");
    fetchRoles();
  };

  // Delete role
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this role?")) return;
    await deleteRole(id);
    fetchRoles();
  };

  return (
    <div className="p-4">
      <h3>User Roles</h3>

      {/* Create role */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Role name"
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
          Create
        </button>
      </div>

      {/* Roles table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Role</th>
            <th>Description</th>
            <th style={{ width: 160 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditingRole(role);
                    setName(role.name);
                    setDescription(role.description);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(role.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* EDIT POPUP */}
      {editingRole && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="bg-white p-4 rounded" style={{ width: 400 }}>
            <h5>Edit Role</h5>

            <input
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="form-control mb-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => {
                  setEditingRole(null);
                  setName("");
                  setDescription("");
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
