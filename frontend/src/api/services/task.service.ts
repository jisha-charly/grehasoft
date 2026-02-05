import api from "../axios";
import type { Task } from "../../types/task";

/* ===============================
   GET TASKS BY PROJECT
================================ */
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
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
  description?: string;
  due_date?: string; // YYYY-MM-DD
  priority?: "low" | "medium" | "high";
  board_order?: number;
}

export const createTask = (projectId: number, payload: CreateTaskPayload) =>
  api.post(`/projects/${projectId}/tasks/`, payload);

/* ===============================
   REORDER TASKS (KANBAN)
================================ */
export const reorderTasks = (payload: any[]) =>
  api.post("/tasks/update-order/", payload);

/* ===============================
   TASK FILES (uploads & reviews)
================================ */
export const getTaskFiles = async (taskId: number) => {
  const res = await api.get(`/tasks/${taskId}/files/`);
  return res.data;
};

export const uploadTaskFile = (
  taskId: number,
  file: File,
  fileType?: string,
) => {
  const fd = new FormData();
  fd.append("file_path", file);
  if (fileType) fd.append("file_type", fileType);

  return api.post(`/tasks/${taskId}/files/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteTaskFile = (fileId: number) =>
  api.delete(`/tasks/files/${fileId}/delete/`);
