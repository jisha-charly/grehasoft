import { useState } from "react";
import { createTask } from "../../api/services/task.service";

const TasksPage = () => {
  const projectId = 1; // TEMP (later from route)
  const taskTypeId = 1; // TEMP (later from dropdown)

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
        title,
        status,
        project_id: projectId,   // ✅ FIXED
        task_type_id: taskTypeId // ✅ REQUIRED
      });

      setTitle("");
      setStatus("todo");
    } catch (err) {
      console.error("Task create failed", err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title"
      />

      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
        <option value="blocked">Blocked</option>
      </select>

      <button onClick={handleCreateTask} disabled={loading}>
        {loading ? "Creating..." : "Add Task"}
      </button>
    </div>
  );
};

export default TasksPage;
