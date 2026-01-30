import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/services/user.service";
import { getRoles } from "../../api/services/role.service";
import { getDepartments } from "../../api/services/department.service";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "../../types/user";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= FETCH ================= */

  const fetchAll = async () => {
    const [u, r, d] = await Promise.all([
      getUsers(),
      getRoles(),
      getDepartments(),
    ]);
    setUsers(u);
    setRoles(r);
    setDepartments(d);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.username) e.username = "Username required";
    if (!form.email) e.email = "Email required";
    if (!editingUser && !form.password)
      e.password = "Password required";
    if (!editingUser && form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.role) e.role = "Role required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    if (!validate()) return;

    const payload: CreateUserPayload = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: Number(form.role),
      department: form.department ? Number(form.department) : null,
    };

    await createUser(payload);
    resetForm();
    fetchAll();
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!editingUser) return;
    if (!validate()) return;

    const payload: UpdateUserPayload = {
      email: form.email,
      role: Number(form.role),
      department: form.department ? Number(form.department) : null,
      is_active: editingUser.is_active,
    };

    await updateUser(editingUser.id, payload);
    resetForm();
    fetchAll();
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteUser(deleteId);
    setDeleteId(null);
    fetchAll();
  };

  /* ================= HELPERS ================= */

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
    });
    setEditingUser(null);
    setErrors({});
  };

  const filteredUsers = users.filter(u =>
    `${u.username} ${u.email} ${u.role_name} ${u.department_name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <>
      <h2>Users</h2>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* CREATE / EDIT */}
      <div className="card p-3 mb-4">
        <h5>{editingUser ? "Edit User" : "Create User"}</h5>

        <form autoComplete="off">
          <div className="row g-2">
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

            <div className="col-md-4">
              <input
                autoComplete="off"
                className={`form-control ${errors.username && "is-invalid"}`}
                placeholder="Username"
                value={form.username}
                disabled={!!editingUser}
                onChange={e =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              <small className="text-danger">{errors.username}</small>
            </div>

            <div className="col-md-4">
              <input
                autoComplete="off"
                className={`form-control ${errors.email && "is-invalid"}`}
                placeholder="Email"
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <small className="text-danger">{errors.email}</small>
            </div>

            <div className="col-md-4">
              <select
                className={`form-control ${errors.role && "is-invalid"}`}
                value={form.role}
                onChange={e =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <small className="text-danger">{errors.role}</small>
            </div>

            {!editingUser && (
              <>
                <div className="col-md-4">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`form-control ${errors.password && "is-invalid"}`}
                      placeholder="Password"
                      value={form.password}
                      onChange={e =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      👁
                    </button>
                  </div>
                  <small className="text-danger">{errors.password}</small>
                </div>

                <div className="col-md-4">
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={`form-control ${
                      errors.confirmPassword && "is-invalid"
                    }`}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={e =>
                      setForm({
                        ...form,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <small className="text-danger">
                    {errors.confirmPassword}
                  </small>
                </div>
              </>
            )}

            <div className="col-md-4">
              <select
                className="form-control"
                value={form.department}
                onChange={e =>
                  setForm({ ...form, department: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={editingUser ? handleUpdate : handleCreate}
            type="button"
          >
            {editingUser ? "Update User" : "Create User"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role_name}</td>
              <td>{u.department_name ?? "-"}</td>
              <td>
                {u.username === "admin" ? (
                  "Protected"
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditingUser(u);
                        setForm({
                          username: u.username,
                          email: u.email,
                          password: "",
                          confirmPassword: "",
                          role: String(u.role_id),
                          department: u.department_id
                            ? String(u.department_id)
                            : "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(u.id)}
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

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Delete User</h5>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this user?
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
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
