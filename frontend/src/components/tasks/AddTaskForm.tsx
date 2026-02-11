import { useEffect, useState } from "react";
import { createTask } from "../../api/services/task.service";
import { getTaskTypes } from "../../api/services/taskType.service";
import { getMilestones } from "../../api/services/milestone.service";

import type { TaskStatus } from "../../types/task";
import type { TaskType } from "../../types/tasktypes";

interface Milestone {
  id: number;
  title: string;
}

interface Props {
  projectId: number;
  onCreated: (uiMilestoneId?: number) => void; // 🔑 pass milestone to parent
}

const AddTaskForm = ({ projectId, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [taskTypeId, setTaskTypeId] = useState<number | "">("");
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);

  // 🌱 milestone (frontend only)
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneId, setMilestoneId] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskTypeData, milestoneData] = await Promise.all([
          getTaskTypes(),
          getMilestones(projectId),
        ]);

        setTaskTypes(taskTypeData);
        setMilestones(milestoneData);
      } catch (err) {
        console.error("Failed to load task form data", err);
      }
    };

    loadData();
  }, [projectId]);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!title) return alert("Enter task title");
    if (!taskTypeId) return alert("Select task type");

    setLoading(true);

    try {
      await createTask(projectId, {
  title,
  status,
  task_type_id: taskTypeId,
  milestone: milestoneId || null,   // ✅ THIS LINE IS MISSING
  priority: "medium",
  board_order: 0,
});

      // reset
      setTitle("");
      setStatus("todo");
      setTaskTypeId("");
      setMilestoneId("");

      // 🔑 send milestone to parent (UI only)
      onCreated(milestoneId || undefined);
    } catch (err) {
      console.error("Task create failed", err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="mb-3">Add Task</h6>

        <div className="row g-2 align-items-end">
          {/* Title */}
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Milestone */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={milestoneId}
              onChange={(e) =>
                setMilestoneId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">Select Milestone</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Task Type */}
          <div className="col-md-2">
            <select
              className="form-select"
              value={taskTypeId}
              onChange={(e) =>
                setTaskTypeId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">Task Type</option>
              {taskTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="col-md-2">
            <select
              className="form-select"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as TaskStatus)
              }
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Add */}
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
