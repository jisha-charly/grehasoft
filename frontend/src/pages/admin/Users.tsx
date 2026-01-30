import { useEffect, useState } from "react";
import type { User } from "../../types/user";
import type { Role } from "../../types/role";
import type { Department } from "../../types/department";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/services/user.service";
import { getRoles } from "../../api/services/role.service";
import { getDepartments } from "../../api/services/department.service";
import { userValidators } from "../../utils/validators";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

type UserForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: number | "";
  department: number | "";
};

const Users = () => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState<UserForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });

  /* ================= LOAD ================= */
  const loadAll = async () => {
    try {
      const [u, r, d] = await Promise.all([
        getUsers(),
        getRoles(),
        getDepartments(),
      ]);
      setUsers(u);
      setRoles(r);
      setDepartments(d);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= VALIDATION ================= */
  const validateCreate = () => {
    const e: Record<string, string> = {};

    if (form.username.trim().length < 3)
      e.username = "Minimum 3 characters";

    if (!userValidators.email.test(form.email))
      e.email = "Invalid email";

    if (!userValidators.password.test(form.password))
      e.password = "Minimum 6 characters";

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (!form.role) e.role = "Role required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!validateCreate()) return;

    try {
      await createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: Number(form.role),
        department: form.department ? Number(form.department) : null,
      });

      toast.success("User created successfully");
      resetForm();
      loadAll();
    } catch {
      toast.error("Failed to create user");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        email: editingUser.email,
        role: editingUser.role_id,
        department: editingUser.department_id ?? null,
        is_active: editingUser.is_active,
      });

      toast.success("User updated successfully");
      setEditingUser(null);
      loadAll();
    } catch {
      toast.error("Failed to update user");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      setDeleteId(null);
      loadAll();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const resetForm = () => {
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

  /* ================= SEARCH + PAGINATION ================= */
  const filtered = users.filter((u) =>
    `${u.username} ${u.email} ${u.role} ${u.department || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= UI ================= */
  return (
    <div className="container mt-3">
      <h3 className="mb-3">Users</h3>

      {/* CREATE USER */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Create User</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              <div className="invalid-feedback">{errors.username}</div>
            </div>

            <div className="col-md-4">
              <input
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            <div className="col-md-4">
              <select
                className={`form-select ${errors.role ? "is-invalid" : ""}`}
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: Number(e.target.value) })
                }
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.role}</div>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: Number(e.target.value) })
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

            <div className="col-md-4">
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <div className="invalid-feedback">{errors.password}</div>
            </div>

            <div className="col-md-4">
              <input
                type="password"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              <div className="invalid-feedback">
                {errors.confirmPassword}
              </div>
            </div>
          </div>

          <button className="btn btn-primary mt-3" onClick={handleCreate}>
            Create User
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th style={{ width: 160 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.department || "-"}</td>
              <td>
                {u.role === "ADMIN" ? (
                  <span className="text-muted">Protected</span>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        setEditingUser({
                          ...u,
                          role_id:
                            roles.find((r) => r.name === u.role)?.id ?? 0,
                          department_id:
                            departments.find(
                              (d) => d.name === u.department
                            )?.id ?? null,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
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

      {/* EDIT + DELETE MODALS remain SAME as your current ones */}
    </div>
  );
};

export default Users;
