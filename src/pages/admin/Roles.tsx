import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Role } from "../../types/role";


const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const loadRoles = async () => {
    const res = await api.get("/roles/");
    setRoles(res.data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const createRole = async () => {
  try {
    await api.post("/roles/create/", { name, description });
    setName("");
    setDescription("");
    loadRoles();
  } catch (error: any) {
    alert(error.response?.data?.error || "Failed to create role");
  }
};


 const deleteRole = async (id: number) => {
  try {
    await api.delete(`/roles/${id}/delete/`);
    loadRoles();
    alert("Role deleted successfully");
  } catch (error: any) {
    if (error.response?.data?.error) {
      alert(error.response.data.error); // ✅ shows ADMIN cannot be deleted
    } else {
      alert("Something went wrong");
    }
  }
};


  return (
    <div>
      <h2>Roles</h2>

      <input
        placeholder="Role name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={createRole}>Create Role</button>

      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>
                <button onClick={() => deleteRole(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
