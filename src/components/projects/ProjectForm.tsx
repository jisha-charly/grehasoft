import { useEffect, useState } from "react";
import { createProject } from "../../api/projects";
import api from "../../api/axios";

interface Props {
  onSuccess: () => void;
}

const ProjectForm = ({ onSuccess }: Props) => {
  const [clients, setClients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    client_id: "",
    department_id: "",
    project_manager_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    api.get("/clients/").then(res => setClients(res.data));
    api.get("/departments/").then(res => setDepartments(res.data));
    api.get("/users/").then(res => setUsers(res.data));
  }, []);

  const submit = async () => {
    if (!form.name || !form.client_id) {
      alert("Project name & client are required");
      return;
    }
await createProject({
  name: form.name,
  client: Number(form.client_id),
  department: Number(form.department_id),
  project_manager: Number(form.project_manager_id),
  start_date: form.start_date || null,
  end_date: form.end_date || null,
});

setForm({
  name: "",
  client_id: "",
  department_id: "",
  project_manager_id: "",
  start_date: "",
  end_date: "",
});


    onSuccess();
  };

  return (
    <div className="card mb-3">
      <div className="card-body row g-2">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Project Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={form.client_id}
            onChange={e => setForm({ ...form, client_id: e.target.value })}
          >
            <option value="">Select Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={form.department_id}
            onChange={e => setForm({ ...form, department_id: e.target.value })}
          >
            <option value="">Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={form.project_manager_id}
            onChange={e => setForm({ ...form, project_manager_id: e.target.value })}
          >
            <option value="">Project Manager</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={form.start_date}
            onChange={e => setForm({ ...form, start_date: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={form.end_date}
            onChange={e => setForm({ ...form, end_date: e.target.value })}
          />
        </div>

        <div className="col-md-12">
          <button className="btn btn-primary" onClick={submit}>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
