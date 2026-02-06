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

/* ===============================
   REORDER TASKS (KANBAN)
================================ */
export const reorderTasks = (payload: any[]) =>
  api.post("/tasks/update-order/", payload);

export const updateTaskStatus = (id: number, status: string) => {
  return api.patch(`/tasks/${id}/status/`, { status });
};