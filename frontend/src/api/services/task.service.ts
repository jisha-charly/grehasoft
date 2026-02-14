import api from "../axios";
import type { Task } from "../../types/task";
import type { TaskStatus } from "../../types/task";

/* ===============================
   GET TASKS BY PROJECT
================================ */
export const getTasksByProject = async (
  projectId: number
): Promise<Task[]> => {
  const res = await api.get(`/projects/${projectId}/tasks/`);
  return res.data;
};

/* ===============================
   CREATE TASK
================================ */
export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
  task_type_id: number;
  milestone?: number | null;   // ✅ ADDED (important)
  priority?: "low" | "medium" | "high";
  board_order?: number;
}

export const createTask = (
  projectId: number,
  payload: CreateTaskPayload
) => api.post(`/projects/${projectId}/tasks/`, payload);

/* ===============================
   DELETE TASK
================================ */
export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}/delete/`);
};

/* ===============================
   UPDATE TASK
================================ */
export const updateTask = async (
  taskId: number,
  payload: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    milestone?: number | null;  // ✅ ADDED here also (safe update)
  }
) => {
  const res = await api.put(`/tasks/${taskId}/update/`, payload);
  return res.data;
};

/* ===============================
   REORDER TASKS (KANBAN)
================================ */
export const reorderTasks = (payload: any[]) =>
  api.post("/tasks/update-order/", payload);

/* ===============================
   UPDATE TASK STATUS
================================ */
export const updateTaskStatus = (id: number, status: string) => {
  return api.patch(`/tasks/${id}/status/`, { status });
};

/* ===============================
   ASSIGN TASK
================================ */
export const assignTask = async (
  taskId: number,
  employeeId: number | null
) => {
  const res = await api.post(`/tasks/${taskId}/assign/`, {
    employee: employeeId,
  });
  return res.data;
};


export const getAllTasks = async () => {
  const response = await api.get("/tasks/");
  return response.data;
};
