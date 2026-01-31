import { useState } from "react";
import KanbanBoard from "../../components/tasks/KanbanBoard";
import { createTask } from "../../api/services/task.service";

const TasksPage = () => {
  const projectId = 1; // 🔴 TEMP (later make dynamic)

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      alert("Task title required");
      return;
    }

    setLoading(true);

    try {
      await createTask({
        project: projectId,
        title,
        status,
        priority: "medium",
        board_order: 0,
      });

      setTitle("");
      setStatus("todo");

      // 🔁 refresh page → Kanban reloads
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Task Management</h3>

        {/* CREATE TASK */}
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleCreateTask}
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Task"}
          </button>
        </div>
      </div>

      {/* KANBAN */}
      <KanbanBoard projectId={projectId} />
    </div>
  );
};

export default TasksPage;
