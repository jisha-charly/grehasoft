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

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const [page, setPage] = useState(1);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "danger";
  } | null>(null);

  /* ================= CREATE FORM ================= */
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "" as number | "",
    department: "" as number | "",
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

  /* ================= TOAST ================= */
  const showToast = (msg: string, type: "success" | "danger") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    try {
      await createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: Number(form.role),
        department: Number(form.department),
      });

      setForm({
        username: "",
        email: "",
        password: "",
        role: "",
        department: "",
      });

      showToast("User created successfully", "success");
      loadAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to create user", "danger");
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

      showToast("User updated successfully", "success");
      setEditingUser(null);
      loadAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Update failed", "danger");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteUserId) return;

    try {
      await deleteUser(deleteUserId);
      showToast("User deleted successfully", "success");
      loadAll();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Delete failed", "danger");
    } finally {
      setDeleteUserId(null);
    }
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-3">
      <h3>Users</h3>

      {/* ================= TOAST ================= */}
      {toast && (
        <div className={`toast show position-fixed top-0 end-0 m-3 text-bg-${toast.type}`}>
          <div className="toast-body">{toast.msg}</div>
        </div>
      )}

      {/* ================= CREATE USER FORM ================= */}
      <div className="card mb-3">
        <div className="card-body">
          <form autoComplete="off" className="d-flex gap-2 flex-wrap">
            <input
              className="form-control"
              placeholder="Username"
              autoComplete="off"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <input
              className="form-control"
              placeholder="Email"
              autoComplete="off"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="form-control"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="form-select"
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

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreate}
            >
              Create User
            </button>
          </form>
        </div>
      </div>

      {/* ================= USERS TABLE ================= */}
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
          {paginatedUsers.map((u) => (
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
                  onClick={() => setDeleteUserId(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT & DELETE MODALS → keep your existing modals */}
    </div>
  );
};

export default Users;
