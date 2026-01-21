import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { User } from "../../types/user";
import type { Role } from "../../types/role";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
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
    await api.post("users/create/", form);

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
      role: editingUser.role,
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

        {/* 🔑 Dynamic Role Dropdown */}
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        <button onClick={createUser}>Create User</button>
      </div>

      {/* ---------------- EDIT USER ---------------- */}
      {editingUser && (
        <div style={{ marginBottom: 20 }}>
          <h3>Edit User: {editingUser.username}</h3>

          <input
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                email: e.target.value,
              })
            }
          />

          <select
            value={editingUser.role}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                role: e.target.value,
              })
            }
          >
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <label>
            Active
            <input
              type="checkbox"
              checked={editingUser.is_active}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  is_active: e.target.checked,
                })
              }
            />
          </label>

          <br />

          <button onClick={updateUser}>Update</button>
          <button onClick={() => setEditingUser(null)}>
            Cancel
          </button>
        </div>
      )}

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
