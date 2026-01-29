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

  /* ================= VALIDATION ================= */
  const validate = (data: UserForm | User, isEdit = false) => {
    const e: Record<string, string> = {};

    if (!data.username || data.username.trim().length < 3) {
      e.username = "Username must be at least 3 characters";
    }

    if (!userValidators.email.test(data.email || "")) {
      e.email = "Invalid email address";
    }

    if (!isEdit) {
      if (!userValidators.password.test((data as UserForm).password)) {
        e.password = "Password must be at least 6 characters";
      }

      if (
        (data as UserForm).password !==
        (data as UserForm).confirmPassword
      ) {
        e.confirmPassword = "Passwords do not match";
      }
    }

    if (!("role" in data) || !data.role) {
      e.role = "Role is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!validate(form)) return;

    const payload: any = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: Number(form.role),
    };

    if (form.department) {
      payload.department = Number(form.department);
    }

    await createUser(payload);
    resetForm();
    loadAll();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editingUser) return;
    if (!validate(editingUser, true)) return;

    await updateUser(editingUser.id, {
      email: editingUser.email,
      role: editingUser.role_id,
      department: editingUser.department_id ?? null,
      is_active: editingUser.is_active,
    });

    setEditingUser(null);
    setErrors({});
    loadAll();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteUser(deleteId);
    setDeleteId(null);
    loadAll();
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

  /* ================= SEARCH (UNIVERSAL) ================= */
  const filtered = users.filter((u) =>
    `${u.username} ${u.email} ${u.role} ${u.department || ""} ${
      u.is_active ? "active" : "inactive"
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= UI ================= */
  return (
    <div className="container mt-3">
      <h3>Users</h3>

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

      {/* CREATE FORM */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          {["username", "email", "password", "confirmPassword"].map(
            (key) => (
              <div className="col-md-3" key={key}>
                <input
                  type={key.includes("password") ? "password" : "text"}
                  className={`form-control ${
                    errors[key] ? "is-invalid" : ""
                  }`}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
                {errors[key] && (
                  <div className="invalid-feedback">{errors[key]}</div>
                )}
              </div>
            )
          )}

          <div className="col-md-3">
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
            {errors.role && (
              <div className="invalid-feedback">{errors.role}</div>
            )}
          </div>

          <div className="col-md-3">
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

          <div className="col-md-12">
            <button className="btn btn-primary" onClick={handleCreate}>
              Create User
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Department</th>
            <th>Created</th>
            <th style={{ width: 140 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span
                  className={`badge ${
                    u.is_active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{u.role}</td>
              <td>{u.department || "-"}</td>
              <td>
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => setEditingUser(u)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteId(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!paginated.length && (
            <tr>
              <td colSpan={7} className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
