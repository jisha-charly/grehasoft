import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/services/user.service";
import type { User, CreateUserPayload } from "../../types/user";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  const [errors, setErrors] = useState<any>({});

  // ================= FETCH =================
  const fetchAll = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ================= SEARCH =================
  const filteredUsers = users.filter(u =>
    `${u.username} ${u.email} ${u.role_name} ${u.department_name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= VALIDATION =================
  const validate = () => {
    const e: any = {};

    if (!form.username.trim()) e.username = "Username required";
    if (!form.email.trim()) e.email = "Email required";
    if (!form.role) e.role = "Role required";

    if (!editingUser) {
      if (!form.password) e.password = "Password required";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!validate()) return;

    const payload: CreateUserPayload = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: Number(form.role),
      department: form.department ? Number(form.department) : null,
    };

    try {
      await createUser(payload);
      resetForm();
      fetchAll();
    } catch {
      setErrors({ api: "Failed to create user" });
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        email: form.email,
        role: Number(form.role),
        department: form.department ? Number(form.department) : null,
        is_active: editingUser.is_active,
      });

      resetForm();
      fetchAll();
    } catch {
      setErrors({ api: "Failed to update user" });
    }
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteUser(deleteId);
    setDeleteId(null);
    fetchAll();
  };

  // ================= HELPERS =================
  const startEdit = (u: User) => {
    setEditingUser(u);
    setForm({
      username: u.username,
      email: u.email,
      password: "",
      confirmPassword: "",
      role: String(u.role_id),
      department: u.department_id ? String(u.department_id) : "",
    });
  };

  const resetForm = () => {
    setEditingUser(null);
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
    });
    setErrors({});
  };

  // ================= UI =================
  return (
    <div className="container-fluid">
      <h3>Users</h3>

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

        <div className="row g-3">
          <div className="col-md-4">
            <input
              autoComplete="off"
              placeholder="Username"
              className={`form-control ${errors.username && "is-invalid"}`}
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
              placeholder="Email"
              className={`form-control ${errors.email && "is-invalid"}`}
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
              <option value="1">ADMIN</option>
              <option value="2">Software PM</option>
              <option value="3">Digital Marketing PM</option>
            </select>
            <small className="text-danger">{errors.role}</small>
          </div>

          {!editingUser && (
            <>
              <div className="col-md-4 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Password"
                  className={`form-control ${errors.password && "is-invalid"}`}
                  value={form.password}
                  onChange={e =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  👁
                </span>
                <small className="text-danger">{errors.password}</small>
              </div>

              <div className="col-md-4">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  className={`form-control ${
                    errors.confirmPassword && "is-invalid"
                  }`}
                  value={form.confirmPassword}
                  onChange={e =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                <small className="text-danger">
                  {errors.confirmPassword}
                </small>
              </div>
            </>
          )}
        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={editingUser ? handleUpdate : handleCreate}
        >
          {editingUser ? "Update User" : "Create User"}
        </button>

        <small className="text-danger">{errors.api}</small>
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
                      onClick={() => startEdit(u)}
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
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Delete user?</h5>
              <div className="mt-3 text-end">
                <button
                  className="btn btn-secondary me-2"
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
      )}
    </div>
  );
};

export default Users;
