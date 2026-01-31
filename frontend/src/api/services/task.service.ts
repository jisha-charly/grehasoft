import api from "../axios";

export const getTasksByProject = (projectId: number) =>
  api.get(`/tasks/project/${projectId}/`);

export const createTask = (data: any) =>
  api.post("/tasks/", data);

export const reorderTasks = (payload: any[]) =>
  api.post("/tasks/reorder/", payload);
