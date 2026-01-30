import { useEffect, useState } from "react";
import { createUser, getUsers, updateUser, deleteUser } from "../../api/services/user.service";
import type { User } from "../../types/user";

interface Role {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const Users = () => {
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

  /* ================= LOAD ALL ================= */

  const fetchAll = async () => {
    try {
      const [usersRes, rolesRes, deptRes] = await Promise.all([
        getUsers(),
        fetch("/api/roles").then(r => r.json()),
        fetch("/api/departments").then(r => r.json()),
      ]);

      setUsers(usersRes);
      setRoles(rolesRes);
      setDepartments(deptRes);
    } catch (err) {
      console.error("Load error", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= FORM HELPERS ================= */

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

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password || !form.role) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: Number(form.role),
      department: form.department
        ? Number(form.department)
        : null, // ✅ IMPORTANT FIX
    };

    try {
      await createUser(payload);
      alert("User created successfully");
      resetForm();
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        email: editingUser.email,
        role: Number(editingUser.role_id),
        department: editingUser.department_id ?? null,
        is_active: editingUser.is_active,
      });

      alert("User updated successfully");
      resetForm();
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteUser(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div>
      <h2>Users</h2>

      {/* CREATE / EDIT FORM */}
      <div className="card p-3 mb-4">
        <h4>{editingUser ? "Edit User" : "Create User"}</h4>

        <input
          placeholder="Username"
          value={form.username}
          disabled={!!editingUser}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        {!editingUser && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </>
        )}

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button onClick={editingUser ? handleUpdate : handleCreate}>
          {editingUser ? "Update User" : "Create User"}
        </button>

        {editingUser && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* USERS LIST */}
      <table>
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
                  "Protected"
                ) : (
                  <>
                    <button onClick={() => setEditingUser(u)}>Edit</button>
                    <button onClick={() => handleDelete(u.id)}>Delete</button>
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
