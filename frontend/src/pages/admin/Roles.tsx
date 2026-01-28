import { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  deleteRole,
  updateRole,
} from "../../api/services/role.service";
import type { Role } from "../../types/role";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // create
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // search
  const [search, setSearch] = useState("");

  // edit modal
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // delete modal
  const [deleteRoleData, setDeleteRoleData] = useState<Role | null>(null);

  // ================= FETCH =================
  const loadRoles = async () => {
    setLoading(true);
    const data = await getRoles();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!name.trim()) return;
    await createRole({ name, description });
    setName("");
    setDescription("");
    loadRoles();
  };

  // ================= EDIT =================
  const openEdit = (role: Role) => {
    setEditRole(role);
    setEditName(role.name);
    setEditDescription(role.description || "");
  };

  const handleUpdate = async () => {
    if (!editRole) return;
    await updateRole(editRole.id, {
      name: editName,
      description: editDescription,
    });
    setEditRole(null);
    loadRoles();
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!deleteRoleData) return;
    await deleteRole(deleteRoleData.id);
    setDeleteRoleData(null);
    loadRoles();
  };

  // ================= FILTER =================
  const filteredRoles = roles.filter((role) =>
    `${role.name} ${role.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3>User Roles</h3>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search roles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ CREATE */}
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

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
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
      {editRole && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Edit Role</h5>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="form-control"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditRole(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdate}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🗑 DELETE MODAL */}
      {deleteRoleData && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Delete Role</h5>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete{" "}
                  <b>{deleteRoleData.name}</b>?
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
        </div>
      )}
    </div>
  );
};

export default Roles;
