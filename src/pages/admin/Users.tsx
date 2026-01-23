import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { User } from "../../types/user";
import type { Role } from "../../types/role";

interface Department {
  id: number;
  name: string;
}

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [page, setPage] = useState(1);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "danger";
  } | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "" as number | "",
    department: "" as number | "",
  });

  /* ---------------- LOAD DATA ---------------- */
  const loadUsers = async () => {
    const res = await api.get<User[]>("users/");
    setUsers(res.data);
  };

  const loadRoles = async () => {
    const res = await api.get<Role[]>("roles/");
    setRoles(res.data);
  };

  const loadDepartments = async () => {
    const res = await api.get<Department[]>("departments/");
    setDepartments(res.data);
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadDepartments();
  }, []);

  /* ---------------- TOAST ---------------- */
  const showToast = (msg: string, type: "success" | "danger") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ---------------- CREATE USER ---------------- */
  const createUser = async () => {
    try {
      await api.post("users/create/", form);
      showToast("User created successfully", "success");
      setForm({
        username: "",
        email: "",
        password: "",
        role: "",
        department: "",
      });
      loadUsers();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to create user", "danger");
    }
  };

  /* ---------------- UPDATE USER ---------------- */
  const updateUser = async () => {
    if (!editingUser) return;

    try {
      await api.put(`users/${editingUser.id}/update/`, {
        email: editingUser.email,
        role: editingUser.role_id,
        department: editingUser.department_id,
        is_active: editingUser.is_active,
      });

      showToast("User updated successfully", "success");
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Update failed", "danger");
    }
  };

  /* ---------------- DELETE USER ---------------- */
  const confirmDelete = async () => {
    if (!deleteUserId) return;

    try {
      await api.delete(`users/${deleteUserId}/delete/`);
      showToast("User deleted successfully", "success");
      loadUsers();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Delete failed", "danger");
    } finally {
      setDeleteUserId(null);
    }
  };

  /* ---------------- FILTERS ---------------- */
  const filteredUsers = users.filter((u) => {
    const textMatch =
      `${u.username} ${u.email} ${u.role} ${u.department ?? ""} ${
        u.is_active ? "active" : "inactive"
      }`
        .toLowerCase()
        .includes(search.toLowerCase());

    const dateMatch =
      createdDate === ""
        ? true
        : u.created_at?.startsWith(createdDate);

    return textMatch && dateMatch;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-3">
      <h3>Users</h3>

      {/* ---------- TOAST ---------- */}
      {toast && (
        <div className={`toast show position-fixed top-0 end-0 m-3 text-bg-${toast.type}`}>
          <div className="toast-body">{toast.msg}</div>
        </div>
      )}

      {/* ---------- CREATE USER ---------- */}
      <div className="card mb-3">
        <div className="card-body d-flex gap-2 flex-wrap">
          <input
            className="form-control"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: Number(e.target.value) })}
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
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
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={createUser}>
            Create User
          </button>
        </div>
      </div>

      {/* ---------- SEARCH + DATE ---------- */}
      <input
        className="form-control mb-2"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={createdDate}
            onChange={(e) => {
              setCreatedDate(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSearch("");
              setCreatedDate("");
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
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
                  onClick={() => setDeleteUserId(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- PAGINATION ---------- */}
      <div className="d-flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ---------- EDIT MODAL ---------- */}
      {editingUser && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit User</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />

                <select
                  className="form-select mb-2"
                  value={editingUser.role_id}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role_id: Number(e.target.value),
                    })
                  }
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>

                <select
                  className="form-select mb-2"
                  value={editingUser.department_id ?? ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      department_id: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={editingUser.is_active}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label">Active</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updateUser}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- DELETE MODAL ---------- */}
      {deleteUserId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                Are you sure you want to delete this user?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteUserId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
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
