import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/services/user.service";
import { getRoles } from "../../api/services/role.service";
import { getDepartments } from "../../api/services/department.service";
import type { User } from "../../types/user";
import type { Role } from "../../types/role";
import type { Department } from "../../types/department";

const Users = () => {
  /* ---------------- STATE ---------------- */
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------------- LOAD ---------------- */
  const loadAll = async () => {
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
    loadAll();
  }, []);

  /* ---------------- HELPERS ---------------- */
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

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.role
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: Number(form.role),
      department: form.department ? Number(form.department) : null,
    };

    try {
      await createUser(payload);
      alert("User created successfully");
      resetForm();
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        email: editingUser.email,
        role: editingUser.role_id,
        department: editingUser.department_id ?? null,
        is_active: editingUser.is_active,
      });
      resetForm();
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    loadAll();
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div>
      <h3 className="mb-3">Users</h3>

      {/* -------- CREATE USER -------- */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Create User</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles
                  .filter((r) => r.name !== "ADMIN")
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-4 position-relative">
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                } position-absolute top-50 end-0 translate-middle-y me-3`}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="col-md-4 position-relative">
              <input
                className="form-control"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                } position-absolute top-50 end-0 translate-middle-y me-3`}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
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

      {/* -------- USERS LIST -------- */}
      <table className="table table-bordered table-striped">
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
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.department ?? "-"}</td>
              <td>
                {u.username === "admin" ? (
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
