import api from "../axios";
import type { TaskType } from "../../types/tasktypes";

/* ================= TASK TYPES ================= */

export const getTaskTypes = async (): Promise<TaskType[]> => {
  const res = await api.get("/task-types/");
  return res.data;
};

export const createTaskType = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await api.post("/task-types/create/", data);
  return res.data;
};

export const updateTaskType = async (
  id: number,
  data: { name: string; description?: string }
) => {
  const res = await api.put(`/task-types/${id}/update/`, data);
  return res.data;
};

export const deleteTaskType = async (id: number) => {
  await api.delete(`/task-types/${id}/delete/`);
};
