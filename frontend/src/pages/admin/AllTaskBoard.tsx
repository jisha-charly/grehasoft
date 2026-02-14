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

  const navigate = useNavigate();

  useEffect(() => {
  loadTasks();
}, []);

const loadTasks = async () => {
  try {
    const data = await getAllTasks();
    setTasks(data);
  } catch (error) {
    console.error(error);
  }
};


  // 🔹 Filter Logic
  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  return (
    <div className="container-fluid p-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Tasks</h4>
          <small className="text-muted">Manage all project tasks</small>
        </div>

        {/* New Task Button */}
        <button
          className="btn btn-dark"
          onClick={() => navigate("/admin/projects/1")}
        >
          + New Task
        </button>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "all" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>

          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "todo" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("todo")}
          >
            To Do
          </button>

          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "in_progress" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("in_progress")}
          >
            In Progress
          </button>

          <button
            className={`btn btn-outline-secondary ${
              activeFilter === "done" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("done")}
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
        {filteredTasks.map((task) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={task.id}>
           <div className="card shadow-sm h-100">
  <div className="card-body d-flex flex-column">

    {/* Project Name */}
    <small className="text-muted mb-1">
      {task.project_name}
    </small>

    {/* Title */}
    <h6 className="fw-bold mb-2">{task.title}</h6>

    {/* Description */}
    <p className="text-muted small flex-grow-1">
      {task.description || "No description available"}
    </p>

    {/* Status + Priority */}
    <div className="d-flex justify-content-between align-items-center mt-3">

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

  </div>
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTaskBoard;
