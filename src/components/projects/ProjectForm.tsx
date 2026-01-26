import { useEffect, useState } from "react";
import { createProject } from "../../api/services/project.service";
import { getClients } from "../../api/services/clients";
import { getDepartments } from "../../api/services/department.service";
import { getUsers } from "../../api/services/user.service";

import type { Client } from "../../types/clients";
import type { Department } from "../../types/department";
import type { User } from "../../types/user";
import type { CreateProjectPayload } from "../../types/project";

interface Props {
  onSuccess: () => void;
}

const ProjectForm = ({ onSuccess }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState({
    name: "",
    client_id: "",
    department_id: "",
    project_manager_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    getClients().then(setClients);
    getDepartments().then(setDepartments);
    getUsers().then(setUsers);
  }, []);

  const submit = async () => {
    if (!form.name || !form.client_id) return;

    const payload: CreateProjectPayload = {
      name: form.name,
      client: Number(form.client_id),
      department: form.department_id
        ? Number(form.department_id)
        : null,
      project_manager: form.project_manager_id
        ? Number(form.project_manager_id)
        : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    await createProject(payload);

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
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={form.client_id}
            onChange={(e) =>
              setForm({ ...form, client_id: e.target.value })
            }
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={form.department_id}
            onChange={(e) =>
              setForm({ ...form, department_id: e.target.value })
            }
          >
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={form.project_manager_id}
            onChange={(e) =>
              setForm({
                ...form,
                project_manager_id: e.target.value,
              })
            }
          >
            <option value="">Project Manager</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={form.start_date}
            onChange={(e) =>
              setForm({ ...form, start_date: e.target.value })
            }
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={form.end_date}
            onChange={(e) =>
              setForm({ ...form, end_date: e.target.value })
            }
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
