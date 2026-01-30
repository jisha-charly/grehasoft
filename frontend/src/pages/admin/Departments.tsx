import { useEffect, useState } from "react";
import type { Department } from "../../types/department";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/services/department.service";
import { validateDepartment } from "../../utils/validators";

const Departments = () => {
  /* ================= STATE ================= */
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [search, setSearch] = useState("");

  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteDeptId, setDeleteDeptId] = useState<number | null>(null);

  // 🔑 Separate error states
  const [createErrors, setCreateErrors] = useState<{ name?: string }>({});
  const [editErrors, setEditErrors] = useState<{ name?: string }>({});

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ================= LOAD ================= */
  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ================= CREATE ================= */
const handleCreate = async () => {
  const validationErrors = validateDepartment(name, departments);

  // 👇 SET ERRORS
  setCreateErrors(validationErrors);

  // 👇 STOP HERE IF ERROR EXISTS
  if (validationErrors.name) {
    return;
  }

  await createDepartment({
    name: name.trim(),
    parent_id: parentId || null,
  });

  setName("");
  setParentId("");
  setCreateErrors({});
  loadDepartments();
};


  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editingDept) return;

    const validationErrors = validateDepartment(
      editingDept.name,
      departments,
      editingDept.id
    );
    setEditErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await updateDepartment(editingDept.id, {
      name: editingDept.name.trim(),
      parent_id: editingDept.parent_id,
    });

    setEditingDept(null);
    setEditErrors({});
    loadDepartments();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteDeptId) return;

    await deleteDepartment(deleteDeptId);
    setDeleteDeptId(null);
    loadDepartments();
  };

  /* ================= SEARCH (ALL FIELDS) ================= */
  const filteredDepartments = departments.filter((d) => {
    const text = search.toLowerCase();

    const nameMatch = d.name.toLowerCase().includes(text);
    const parentMatch = (d.parent_name ?? "")
      .toLowerCase()
      .includes(text);

    const rawDateMatch = (d.created_at ?? "")
      .toLowerCase()
      .includes(text);

    const formattedDateMatch = d.created_at
      ? new Date(d.created_at)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toLowerCase()
          .includes(text)
      : false;

    return nameMatch || parentMatch || rawDateMatch || formattedDateMatch;
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(
    filteredDepartments.length / itemsPerPage
  );

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= UI ================= */
  return (
    <div className="container mt-3">
      <h3>Departments</h3>

      {/* CREATE */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Department name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {createErrors.name && (
                <small className="text-danger">
                  {createErrors.name}
                </small>
              )}
            </div>

            <div className="col-md-5">
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
            </div>

            <div className="col-md-2 d-grid">
              <button
  type="button"
  className="btn btn-primary"
  onClick={handleCreate}
>
  Add
</button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search departments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Created</th>
            <th style={{ width: 160 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDepartments.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No departments found
              </td>
            </tr>
          ) : (
            paginatedDepartments.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.parent_name || "-"}</td>
                <td>
                  {d.created_at
                    ? new Date(d.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setEditingDept(d);
                      setEditErrors({});
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeleteDeptId(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-end">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* EDIT MODAL */}
      {editingDept && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Department</h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editingDept.name}
                  onChange={(e) =>
                    setEditingDept({ ...editingDept, name: e.target.value })
                  }
                />
                {editErrors.name && (
                  <small className="text-danger">
                    {editErrors.name}
                  </small>
                )}

                <select
                  className="form-select mt-2"
                  value={editingDept.parent_id ?? ""}
                  onChange={(e) =>
                    setEditingDept({
                      ...editingDept,
                      parent_id: Number(e.target.value) || null,
                    })
                  }
                >
                  <option value="">Main Department</option>
                  {departments
                    .filter((d) => d.id !== editingDept.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingDept(null);
                    setEditErrors({});
                  }}
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
      {deleteDeptId && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                Are you sure you want to delete this department?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteDeptId(null)}
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

export default Departments;
