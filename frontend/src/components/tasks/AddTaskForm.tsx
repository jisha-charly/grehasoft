import { useEffect, useState } from "react";
import { createTask } from "../../api/services/task.service";
import { getTaskTypes } from "../../api/services/taskType.service";

import type { TaskStatus } from "../../types/task";
import type { TaskType } from "../../types/tasktypes";

interface Props {
  projectId: number;
  onCreated: () => void;
}

const AddTaskForm = ({ projectId, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [taskTypeId, setTaskTypeId] = useState<number | "">("");
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTaskTypes = async () => {
      try {
        const data = await getTaskTypes(); // ✅ already array
        setTaskTypes(data);
      } catch (err) {
        console.error("Failed to load task types", err);
      }
    };

    loadTaskTypes();
  }, []);

const submit = async () => {
  if (!title) return alert("Enter task title");
  if (!taskTypeId) return alert("Select task type");

  setLoading(true);

  try {
    await createTask(projectId, {
      title,
      status,
      task_type_id: taskTypeId,
     priority: "medium",   // ✅ REQUIRED
      board_order: 0        // ✅ REQUIRED
    });

    setTitle("");
    setStatus("todo");
    setTaskTypeId("");

    onCreated();
  } catch (err) {
    console.error("Task create failed", err);
    alert("Failed to create task");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="mb-3">Add Task</h6>

        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={taskTypeId}
              onChange={e =>
                setTaskTypeId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">Select Task Type</option>
              {taskTypes.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
           <select
  className="form-select"
  value={status}
  onChange={e => setStatus(e.target.value as TaskStatus)}
>
  <option value="todo">To Do</option>
  <option value="in_progress">In Progress</option>
  <option value="done">Done</option>
  <option value="blocked">Blocked</option>
</select>

          </div>

          <div className="col-md-2 d-grid">
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
