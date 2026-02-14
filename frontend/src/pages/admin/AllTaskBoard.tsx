import { useEffect, useState } from "react";
import { getAllTasks } from "../../api/services/task.service";
import type { Task } from "../../types/task";
import { useNavigate } from "react-router-dom";

const AllTaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "todo" | "in_progress" | "done"
  >("all");

  // 🔍 Search state
  const [searchTerm, setSearchTerm] = useState("");

  // 📄 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter Logic (status)
  const statusFiltered =
    activeFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  // 🔍 Search Filter
  const filteredTasks = statusFiltered.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.assignment?.employee_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination Logic
  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="container-fluid p-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Tasks</h4>
          <small className="text-muted">Manage all project tasks</small>
        </div>

        <button
          className="btn btn-dark"
          onClick={() => navigate("/admin/projects/1")}
        >
          + New Task
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, project, or assigned user..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
          />
        </div>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "all" ? "active" : ""
            }`}
            onClick={() => {
              setActiveFilter("all");
              setCurrentPage(1);
            }}
          >
            All
          </button>

          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "todo" ? "active" : ""
            }`}
            onClick={() => {
              setActiveFilter("todo");
              setCurrentPage(1);
            }}
          >
            To Do
          </button>

          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "in_progress" ? "active" : ""
            }`}
            onClick={() => {
              setActiveFilter("in_progress");
              setCurrentPage(1);
            }}
          >
            In Progress
          </button>

          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "done" ? "active" : ""
            }`}
            onClick={() => {
              setActiveFilter("done");
              setCurrentPage(1);
            }}
          >
            Completed
          </button>
        </div>
      </div>

      {/* ================= LOADING / EMPTY ================= */}
      {loading && <p>Loading tasks...</p>}

      {!loading && filteredTasks.length === 0 && (
        <div className="text-muted">No tasks found.</div>
      )}

      {/* ================= TASK CARDS ================= */}
      <div className="row g-4">
        {currentTasks.map((task) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={task.id}>
            <div className="card task-card h-100 border-0">
              <div className="card-body d-flex flex-column">

                <small className="text-muted fw-semibold mb-1">
                  {task.project_name}
                </small>

                <h6 className="fw-bold mb-2">{task.title}</h6>

                <p className="text-muted small flex-grow-1">
                  {task.description || "No description available"}
                </p>

                <div className="small text-muted mb-2">
                  {task.due_date && (
                    <div>
                      <i className="bi bi-calendar-event me-1"></i>
                      Due: {task.due_date}
                    </div>
                  )}

                  {task.assignment && (
                    <div>
                      <i className="bi bi-person me-1"></i>
                      {task.assignment.employee_name}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
                  <span
                    className={`badge ${
                      task.status === "todo"
                        ? "bg-secondary"
                        : task.status === "in_progress"
                        ? "bg-primary"
                        : task.status === "done"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>

                  <span
                    className={`badge ${
                      task.priority === "high"
                        ? "bg-danger"
                        : task.priority === "medium"
                        ? "bg-warning text-dark"
                        : "bg-light text-dark"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary w-50">
                    Edit
                  </button>
                  <button className="btn btn-sm btn-dark w-50">
                    View Details
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">

              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
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
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllTaskBoard;
