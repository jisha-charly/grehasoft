import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Client } from "../../types/clients";


const ITEMS_PER_PAGE = 5;

/* ---------------- VALIDATORS ---------------- */
const validators = {
  name: /^[A-Za-z\s]{3,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
};

const Clients = () => {
  /* ---------------- STATE ---------------- */
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    gst_no: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ---------------- LOAD ---------------- */
  const loadClients = async () => {
    const res = await api.get<Client[]>("clients/");
    setClients(res.data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  /* ---------------- VALIDATION ---------------- */
  const validateClient = (data: any) => {
    const newErrors: Record<string, string> = {};

    if (!validators.name.test(data.name)) {
      newErrors.name = "Name must contain only letters (min 3)";
    }

    if (!validators.email.test(data.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!validators.phone.test(data.phone)) {
      newErrors.phone = "Phone must be 10 digits (India)";
    }

    if (data.gst_no && !validators.gst.test(data.gst_no)) {
      newErrors.gst_no = "Invalid GST number";
    }

    if (!data.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- CREATE ---------------- */
  const createClient = async () => {
    if (!validateClient(form)) return;

    await api.post("clients/create/", form);
    setForm({
      name: "",
      email: "",
      phone: "",
      company_name: "",
      gst_no: "",
      address: "",
    });
    setErrors({});
    loadClients();
  };

  /* ---------------- UPDATE ---------------- */
  const updateClient = async () => {
    if (!editing) return;
    if (!validateClient(editing)) return;

    await api.put(`clients/${editing.id}/update/`, editing);
    setEditing(null);
    setErrors({});
    loadClients();
  };

  /* ---------------- DELETE ---------------- */
  const deleteClient = async () => {
    if (!deleteId) return;
    await api.delete(`clients/${deleteId}/delete/`);
    setDeleteId(null);
    loadClients();
  };

  /* ---------------- SEARCH ---------------- */
  const filtered = clients.filter((c) =>
    `${c.name} ${c.email} ${c.company_name} ${c.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-3">
      <h3>Clients</h3>

      {/* CREATE FORM */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          {Object.entries(form).map(([key, value]) => (
            <div className="col-md-4" key={key}>
              <input
                className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                placeholder={key.replace("_", " ").toUpperCase()}
                value={value}
                type={key === "phone" ? "tel" : "text"}
                maxLength={key === "phone" ? 10 : undefined}
                inputMode={key === "phone" ? "numeric" : undefined}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
              {errors[key] && (
                <div className="invalid-feedback">{errors[key]}</div>
              )}
            </div>
          ))}
          <div className="col-md-12">
            <button className="btn btn-primary" onClick={createClient}>
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Created</th>
            <th style={{ width: 140 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.company_name}</td>
              <td>{new Date(c.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => setEditing(c)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteId(c.id)}
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
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setPage(1)}
          >
            First
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Client</h5>
              </div>
              <div className="modal-body row g-2">
                {Object.entries(editing).map(
                  ([key, value]) =>
                    key !== "id" &&
                    key !== "created_at" && (
                      <div className="col-md-6" key={key}>
                        <input
                          className={`form-control ${
                            errors[key] ? "is-invalid" : ""
                          }`}
                          value={value ?? ""}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              [key]: e.target.value,
                            })
                          }
                        />
                        {errors[key] && (
                          <div className="invalid-feedback">
                            {errors[key]}
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updateClient}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">Delete this client?</div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={deleteClient}>
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

export default Clients;
