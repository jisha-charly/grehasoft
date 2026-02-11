import api from "../axios";
import type { Task } from "../../types/task";

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
import type { TaskStatus } from "../../types/task";

export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
  task_type_id: number;
  priority?: "low" | "medium" | "high";
  board_order?: number;
}

export const createTask = (
  projectId: number,
  payload: CreateTaskPayload
) => api.post(`/projects/${projectId}/tasks/`, payload);





export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}/delete/`);
};


export const updateTask = async (
  taskId: number,
  payload: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
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

export const updateTaskStatus = (id: number, status: string) => {
  return api.patch(`/tasks/${id}/status/`, { status });
};

export const assignTask = async (
  taskId: number,
  employeeId: number | null
) => {
  const res = await api.post(`/tasks/${taskId}/assign/`, {
    employee: employeeId,
  });
  return res.data;
};
