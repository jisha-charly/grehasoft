import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/services/user.service";
import { getRoles } from "../../api/services/role.service";
import { getDepartments } from "../../api/services/department.service";
import type { User, CreateUserPayload } from "../../types/user";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  /* ---------- FETCH ---------- */
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

  /* ---------- FORM ---------- */
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
  };

  /* ---------- CREATE ---------- */
  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password || !form.role) {
      alert("All required fields must be filled");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // ✅ IMPORTANT FIX: department is NEVER undefined
    const payload: CreateUserPayload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: Number(form.role),
      department: form.department ? Number(form.department) : null,
    };

    try {
      await createUser(payload);
      resetForm();
      fetchAll();
      alert("User created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        email: editingUser.email,
        role: Number(editingUser.role_id),
        department: editingUser.department_id ?? null,
        is_active: editingUser.is_active,
      });

      resetForm();
      fetchAll();
      alert("User updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container">
      <h2>Users</h2>

      {/* ---------- CREATE USER ---------- */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Create User</h5>

          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Username"
                value={form.username}
                onChange={e =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
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
            </div>

            <div className="col-md-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={e =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
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

          <button className="btn btn-primary mt-3" onClick={handleCreate}>
            Create User
          </button>
        </div>
      </div>

      {/* ---------- USERS TABLE ---------- */}
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.department ?? "-"}</td>
              <td>
                {u.role === "ADMIN" ? (
                  <span className="text-muted">Protected</span>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => setEditingUser(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u.id)}
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
    </div>
  );
};

export default Users;
