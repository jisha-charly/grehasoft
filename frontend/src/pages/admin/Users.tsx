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
      const f = data as UserForm;

      if (!userValidators.password.test(f.password)) {
        e.password = "Password must be at least 6 characters";
      }

      if (f.password !== f.confirmPassword) {
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

    if (form.department !== "") {
      payload.department = Number(form.department);
    }

    try {
      await createUser(payload);
      resetForm();
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create user");
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

      setEditingUser(null);
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId);
      loadAll();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    } finally {
      setDeleteId(null);
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

  /* ================= SEARCH ================= */
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
          {["username", "email", "password", "confirmPassword"].map((key) => (
            <div className="col-md-3" key={key}>
              <input
                type={key.includes("password") ? "password" : "text"}
                className={`form-control ${errors[key] ? "is-invalid" : ""}`}
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
          ))}

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
                <span className={`badge ${u.is_active ? "bg-success" : "bg-secondary"}`}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{u.role}</td>
              <td>{u.department || "-"}</td>
              <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
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

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit User</h5>
              </div>
              <div className="modal-body row g-2">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={editingUser.role_id}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role_id: Number(e.target.value),
                      })
                    }
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={editingUser.department_id ?? ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        department_id: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  >
                    <option value="">No Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
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
      )}
    </div>
  );
};

export default Users;
