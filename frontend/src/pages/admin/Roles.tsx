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

  // Edit popup
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Delete popup
  const [deleteRoleData, setDeleteRoleData] = useState<Role | null>(null);

  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // CREATE
  const handleCreate = async () => {
    if (!name.trim()) return;
    await createRole({ name, description });
    setName("");
    setDescription("");
    fetchRoles();
  };

  // UPDATE
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

  // DELETE
  const handleDelete = async () => {
    if (!deleteRoleData) return;

    await deleteRole(deleteRoleData.id);
    setDeleteRoleData(null);
    fetchRoles();
  };

  return (
    <div className="p-4">
      <h3>User Roles</h3>

      {/* CREATE */}
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

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Role</th>
            <th>Description</th>
            <th style={{ width: 180 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
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
        onClick={() => setDeleteRoleData(role)}
      >
        Delete
      </button>
    </>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT POPUP ================= */}
      {editingRole && (
        <div className="modal-backdrop-custom">
          <div className="modal-box">
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

      {/* ================= DELETE POPUP ================= */}
      {deleteRoleData && (
        <div className="modal-backdrop-custom">
          <div className="modal-box">
            <h5>Delete Role</h5>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteRoleData.name}</strong>?
            </p>

            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
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
      )}

      {/* SIMPLE MODAL STYLES */}
      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
        }
      `}</style>
    </div>
  );
};

export default Roles;
