import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  gst_no: string | null;
  address: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 5;

const Clients = () => {
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

  const [editing, setEditing] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ---------- LOAD ----------
  const loadClients = async () => {
    const res = await api.get<Client[]>("clients/");
    setClients(res.data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  // ---------- CREATE ----------
  const createClient = async () => {
    await api.post("clients/create/", form);
    setForm({
      name: "",
      email: "",
      phone: "",
      company_name: "",
      gst_no: "",
      address: "",
    });
    loadClients();
  };

  // ---------- UPDATE ----------
  const updateClient = async () => {
    if (!editing) return;
    await api.put(`clients/${editing.id}/update/`, editing);
    setEditing(null);
    loadClients();
  };

  // ---------- DELETE ----------
  const deleteClient = async () => {
    if (!deleteId) return;
    await api.delete(`clients/${deleteId}/delete/`);
    setDeleteId(null);
    loadClients();
  };

  // ---------- SEARCH ----------
  const filtered = clients.filter((c) =>
    `${c.name} ${c.email} ${c.company_name} ${c.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-3">
      <h3>Clients</h3>

      {/* CREATE */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          {Object.entries(form).map(([key, value]) => (
            <div className="col-md-4" key={key}>
              <input
                className="form-control"
                placeholder={key.replace("_", " ").toUpperCase()}
                value={value}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
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
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(1)}>First</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="btn btn-sm btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(totalPages)}>Last</button>
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
                          className="form-control"
                          value={value ?? ""}
                          onChange={(e) =>
                            setEditing({ ...editing, [key]: e.target.value })
                          }
                        />
                      </div>
                    )
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-success" onClick={updateClient}>Save</button>
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
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={deleteClient}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
