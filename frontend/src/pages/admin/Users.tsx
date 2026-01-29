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

    if (form.department !== "") {
      payload.department = Number(form.department);
    }

    await createUser(payload);
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

    setEditingUser(null);
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
      <form autoComplete="off">
        <input type="text" style={{ display: "none" }} />
        <input type="password" style={{ display: "none" }} />

        <div className="card mb-3">
          <div className="card-body row g-2">

            {/* USERNAME */}
            <div className="col-md-3">
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

            {/* EMAIL */}
            <div className="col-md-3">
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

            {/* PASSWORD */}
            <div className="col-md-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 12,
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                }}
                onClick={() => setShowPassword(!showPassword)}
              />
              <div className="invalid-feedback">{errors.password}</div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="col-md-3 position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Confirm Password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                }`}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 12,
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                }}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
              <div className="invalid-feedback">
                {errors.confirmPassword}
              </div>
            </div>

            {/* ROLE */}
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
              <div className="invalid-feedback">{errors.role}</div>
            </div>

            {/* DEPARTMENT */}
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreate}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      </form>

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

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                />

                <button
                  className="btn btn-success me-2"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
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
                <button className="btn btn-danger" onClick={handleDelete}>
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
