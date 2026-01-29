import { useEffect, useState } from "react";
import type { Client } from "../../types/clients";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/services/clients";
import { clientValidators } from "../../utils/validators";

const ITEMS_PER_PAGE = 5;

const Clients = () => {
  /* ================= STATE ================= */
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState<Partial<Client>>({
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

  /* ================= LOAD ================= */
  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = (data: Partial<Client>) => {
    const e: Record<string, string> = {};

    if (!clientValidators.name.test(data.name || "")) {
      e.name = "Name must be at least 3 letters";
    }

    if (!clientValidators.email.test(data.email || "")) {
      e.email = "Invalid email address";
    }

    if (!clientValidators.phone.test(data.phone || "")) {
      e.phone = "Phone must be 10 digits";
    }

    if (!data.company_name?.trim()) {
      e.company_name = "Company name is required";
    }

    if (data.gst_no && !clientValidators.gst.test(data.gst_no)) {
      e.gst_no = "Invalid GST number";
    }

    if (!data.address?.trim()) {
      e.address = "Address is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!validate(form)) return;

    await createClient(form);
    resetForm();
    loadClients();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editing) return;
    if (!validate(editing)) return;

    await updateClient(editing.id, editing);
    setEditing(null);
    loadClients();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteClient(deleteId);
    setDeleteId(null);
    loadClients();
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      company_name: "",
      gst_no: "",
      address: "",
    });
    setErrors({});
  };

  /* ================= UNIVERSAL SEARCH ================= */
  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.company_name.toLowerCase().includes(q) ||
      (c.gst_no?.toLowerCase().includes(q) ?? false) ||
      c.address.toLowerCase().includes(q)
    );
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= UI ================= */
  return (
    <div className="container mt-3">
      <h3 className="mb-3">Clients</h3>

      {/* CREATE FORM */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          {Object.entries(form).map(([key, value]) => (
            <div className="col-md-4" key={key}>
              <input
                className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                placeholder={key.replace("_", " ").toUpperCase()}
                value={value ?? ""}
                onChange={(e) => {
                  setForm({ ...form, [key]: e.target.value });
                  setErrors({ ...errors, [key]: "" });
                }}
              />
              {errors[key] && (
                <div className="invalid-feedback">{errors[key]}</div>
              )}
            </div>
          ))}

          <div className="col-12">
            <button className="btn btn-primary" onClick={handleCreate}>
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* UNIVERSAL SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search by name, email, phone, company, GST, address..."
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
                  onClick={() => {
                    setEditing(c);
                    setErrors({});
                  }}
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

          {!paginated.length && (
            <tr>
              <td colSpan={6} className="text-center">
                No clients found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex gap-1 flex-wrap">
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
                          onChange={(e) => {
                            setEditing({
                              ...editing,
                              [key]: e.target.value,
                            });
                            setErrors({ ...errors, [key]: "" });
                          }}
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
                <button className="btn btn-success" onClick={handleUpdate}>
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
                <button className="btn btn-danger" onClick={handleDelete}>
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
