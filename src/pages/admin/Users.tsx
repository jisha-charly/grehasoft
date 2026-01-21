import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { User } from "../../types/user";
import type { Role } from "../../types/role";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState<{
    username: string;
    email: string;
    password: string;
    role: number | "";
  }>({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  // ---------------- LOAD USERS ----------------
  const loadUsers = async () => {
    const res = await api.get<User[]>("users/");
    setUsers(res.data);
  };

  // ---------------- LOAD ROLES ----------------
  const loadRoles = async () => {
    const res = await api.get<Role[]>("roles/");
    setRoles(res.data);
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // ---------------- CREATE USER ----------------
  const createUser = async () => {
    await api.post("users/create/", {
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role, // ✅ role ID
    });

    setForm({
      username: "",
      email: "",
      password: "",
      role: "",
    });

    loadUsers();
  };

  // ---------------- UPDATE USER ----------------
  const updateUser = async () => {
    if (!editingUser) return;

    await api.put(`users/${editingUser.id}/update/`, {
      email: editingUser.email,
      role: editingUser.role_id, // ✅ role ID
      is_active: editingUser.is_active,
    });

    setEditingUser(null);
    loadUsers();
  };

  // ---------------- DELETE USER ----------------
  const deleteUser = async (id: number) => {
    await api.delete(`users/${id}/delete/`);
    loadUsers();
  };

  return (
    <div>
      <h2>Users</h2>

      {/* ---------------- CREATE USER FORM ---------------- */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* ✅ Role dropdown uses ID */}
        <select
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

        <button onClick={createUser}>Create User</button>
      </div>

      {/* ---------------- USERS TABLE ---------------- */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_active ? "Active" : "Inactive"}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => setEditingUser(u)}>
                  Edit
                </button>
                <button onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
