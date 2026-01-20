import { useEffect, useState } from "react";
import { authFetch } from "../../api/authFetch";

import type { User } from "../../types/user";


const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "SOFTWARE_EMP",
  });

  // ---------------- LOAD USERS ----------------
  const loadUsers = async () => {
    const res = await authFetch("http://127.0.0.1:8000/api/users/");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ---------------- CREATE USER ----------------
  const createUser = async () => {
    await authFetch("http://127.0.0.1:8000/api/users/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      username: "",
      email: "",
      password: "",
      role: "SOFTWARE_EMP",
    });

    loadUsers();
  };

  // ---------------- UPDATE USER ----------------
  const updateUser = async () => {
    if (!editingUser) return;

    await authFetch(
      `http://127.0.0.1:8000/api/users/${editingUser.id}/update/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editingUser.email,
          role: editingUser.role,
          is_active: editingUser.is_active,
        }),
      }
    );

    setEditingUser(null);
    loadUsers();
  };

  // ---------------- DELETE USER ----------------
  const deleteUser = async (id: number) => {
    await authFetch(
      `http://127.0.0.1:8000/api/users/${id}/delete/`,
      { method: "DELETE" }
    );
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
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="SOFTWARE_PM">Software PM</option>
          <option value="DM_PM">Digital Marketing PM</option>
          <option value="SOFTWARE_EMP">Software Employee</option>
          <option value="DM_EMP">Digital Marketing Employee</option>
        </select>

        <button onClick={createUser}>Create User</button>
      </div>

      {/* ---------------- EDIT USER FORM ---------------- */}
      {editingUser && (
        <div style={{ marginBottom: 20 }}>
          <h3>Edit User: {editingUser.username}</h3>

          <input
            placeholder="Email"
            value={editingUser.email}
            onChange={e =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />

          <select
            value={editingUser.role}
            onChange={e =>
              setEditingUser({ ...editingUser, role: e.target.value })
            }
          >
            <option value="ADMIN">Admin</option>
            <option value="SOFTWARE_PM">Software PM</option>
            <option value="DM_PM">Digital Marketing PM</option>
            <option value="SOFTWARE_EMP">Software Employee</option>
            <option value="DM_EMP">Digital Marketing Employee</option>
          </select>

          <label style={{ marginLeft: 10 }}>
            Active
            <input
              type="checkbox"
              checked={editingUser.is_active}
              onChange={e =>
                setEditingUser({
                  ...editingUser,
                  is_active: e.target.checked,
                })
              }
            />
          </label>

          <br />

          <button onClick={updateUser}>Update</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_active ? "Active" : "Inactive"}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => setEditingUser(u)}>Edit</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
