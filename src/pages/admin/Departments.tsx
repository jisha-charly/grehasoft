import { useEffect, useState } from "react";
import api from "../../api/axios";

const Departments = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");

  const loadDepartments = async () => {
    const res = await api.get("departments/");
    setDepartments(res.data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const createDepartment = async () => {
    await api.post("departments/create/", {
      name,
      parent_id: parentId || null,
    });
    setName("");
    setParentId("");
    loadDepartments();
  };

  return (
    <div className="container mt-3">
      <h3>Departments</h3>

      <div className="card mb-3">
        <div className="card-body d-flex gap-2">
          <input
            className="form-control"
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="form-select"
            value={parentId}
            onChange={(e) => setParentId(Number(e.target.value))}
          >
            <option value="">Main Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={createDepartment}>
            Add
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Parent</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.parent_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Departments;
