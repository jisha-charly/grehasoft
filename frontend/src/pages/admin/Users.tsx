import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/services/user.service";
import { getRoles } from "../../api/services/role.service";
import { getDepartments } from "../../api/services/department.service";
import type { User, CreateUserPayload } from "../../types/user";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  department: "",
};

const Users = () => {
  const location = useLocation();
  const highlightUserId = location.state?.highlightUserId;

  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<any>({});

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    email: "",
    role: "",
    department: "",
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ================= FETCH =================
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

  // ================= AUTO SCROLL =================
  useEffect(() => {
    if (highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightUserId, users]);

  // ================= SEARCH =================
  const filteredUsers = users.filter(u =>
    `${u.username} ${u.email} ${u.role_name ?? ""} ${u.department_name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= VALIDATION =================
  const validateCreate = () => {
    const e: any = {};
    if (!form.username.trim()) e.username = "Username required";
    if (!form.email.trim()) e.email = "Email required";
    if (!form.role) e.role = "Role required";
    if (!form.password) e.password = "Password required";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!validateCreate()) return;

    const payload: CreateUserPayload = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: Number(form.role),
      department: form.department ? Number(form.department) : null,
    };

    try {
      await createUser(payload);
      setForm(emptyForm);
      setErrors({});
      fetchAll();
    } catch (err: any) {
      setErrors({
        api:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to create user",
      });
    }
  };

  // ================= EDIT =================
  const startEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({
      email: u.email,
      role: String(u.role_id),
      department: u.department_id ? String(u.department_id) : "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    await updateUser(editingUser.id, {
      email: editForm.email,
      role: Number(editForm.role),
      department: editForm.department ? Number(editForm.department) : null,
      is_active: editingUser.is_active,
    });

    closeEdit();
    fetchAll();
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({ email: "", role: "", department: "" });
  };

  // ================= DELETE =================
  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteUser(deleteId);
    setDeleteId(null);
    setShowDeleteModal(false);
    fetchAll();
  };

  // ================= UI =================
  return (
    <div className="container-fluid">
      <h3>Users</h3>

      <input
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ================= CREATE USER ================= */}
      <form autoComplete="off">
        {/* Chrome autofill killer */}
        <input type="text" name="fakeusernameremembered" style={{ display: "none" }} />
        <input type="password" name="fakepasswordremembered" style={{ display: "none" }} />

        <div className="card p-3 mb-4">
          <h5>Create User</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                name="new-username"
                autoComplete="off"
                placeholder="Username"
                className={`form-control ${errors.username && "is-invalid"}`}
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
              <small className="text-danger">{errors.username}</small>
            </div>

            <div className="col-md-4">
              <input
                name="new-email"
                type="email"
                autoComplete="off"
                placeholder="Email"
                className={`form-control ${errors.email && "is-invalid"}`}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <small className="text-danger">{errors.email}</small>
            </div>

            <div className="col-md-4">
              <select
                className={`form-control ${errors.role && "is-invalid"}`}
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <small className="text-danger">{errors.role}</small>
            </div>

            <div className="col-md-4">
              <input
                type={showPassword ? "text" : "password"}
                name="new-password"
                autoComplete="new-password"
                placeholder="Password"
                className={`form-control ${errors.password && "is-invalid"}`}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <small className="text-danger">{errors.password}</small>
            </div>

            <div className="col-md-4">
              <input
                type={showPassword ? "text" : "password"}
                name="confirm-new-password"
                autoComplete="new-password"
                placeholder="Confirm Password"
                className={`form-control ${errors.confirmPassword && "is-invalid"}`}
                value={form.confirmPassword}
                onChange={e =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              <small className="text-danger">{errors.confirmPassword}</small>
            </div>

            <div className="col-md-4">
              <select
                className="form-control"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={handleCreate}
          >
            Create User
          </button>

          {errors.api && (
            <small className="text-danger d-block mt-2">{errors.api}</small>
          )}
        </div>
      </form>

      {/* ================= USERS TABLE ================= */}
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
            <tr
              key={u.id}
              ref={u.id === highlightUserId ? highlightedRowRef : null}
            >
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role_name ?? "-"}</td>
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
                      onClick={() => {
                        setDeleteId(u.id);
                        setShowDeleteModal(true);
                      }}
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
