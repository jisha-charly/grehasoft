import api from "../axios";
import type { Task } from "../../types/task";
export const getTasksByProject = async (
  projectId: number
): Promise<Task[]> => {
  const res = await api.get(`/tasks/?project_id=${projectId}`);
  return res.data;
};

export const createTask = async (data: {
  title: string;
  status: string;
  project_id: number;
  task_type_id: number;
  priority?: string;
  board_order?: number;
}) => {
  return api.post("/tasks/", data);
};


export const reorderTasks = (payload: any[]) =>
  api.post("/tasks/reorder/", payload);
