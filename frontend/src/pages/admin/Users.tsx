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
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const payload: any = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: Number(form.role),
    };

    if (form.department) payload.department = Number(form.department);

    await createUser(payload);
    toast.success("User created successfully");
    resetForm();
    loadAll();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editingUser) return;

    await updateUser(editingUser.id, {
      email: editingUser.email,
      role: editingUser.role_id,
      department: editingUser.department_id ?? null,
      is_active: editingUser.is_active,
    });

    toast.success("User updated successfully");
    setEditingUser(null);
    loadAll();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteUser(deleteId);
    toast.success("User deleted successfully");
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
        <thead>
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
        roles.find(r => r.name === u.role)?.id ?? 0,
      department_id:
        departments.find(d => d.name === u.department)?.id ?? 0,
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

      {/* EDIT MODAL */}
      {editingUser && (
  <div className="modal show d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5 className="modal-title">Edit User</h5>
          <button
            className="btn-close"
            onClick={() => setEditingUser(null)}
          />
        </div>

        <div className="modal-body">

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
          </div>

          {/* ROLE */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={editingUser.role_id ?? ""}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  role_id: Number(e.target.value),
                })
              }
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* DEPARTMENT */}
          <div className="mb-3">
            <label className="form-label">Department</label>
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
              <option value="">None</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIVE */}
          <div className="form-check form-switch">
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
            <label className="form-check-label">
              Active
            </label>
          </div>

        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  </div>
)}


      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">Delete this user?</div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
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
