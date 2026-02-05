import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
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
    if (!title) {
      toast.error("Enter task title");
      return;
    }
    if (!taskTypeId) {
      toast.error("Select task type");
      return;
    }

    setLoading(true);

    try {
      await createTask(projectId, {
        title,
        status,
        task_type_id: taskTypeId,
        description: description || undefined,
        due_date: dueDate || undefined,
        priority: "medium",
        board_order: 0,
      });

      setTitle("");
      setStatus("todo");
      setTaskTypeId("");
      setDescription("");
      setDueDate("");

      onCreated();
      toast.success("Task added");
    } catch (err: any) {
      console.error("Task create failed", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Failed to create task";
      toast.error(String(msg));
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
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={taskTypeId}
              onChange={(e) =>
                setTaskTypeId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">Select Task Type</option>
              {taskTypes.map((t) => (
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
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
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

        <div className="row g-2 mt-2">
          <div className="col-md-9">
            <textarea
              className="form-control"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
