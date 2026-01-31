import api from "../axios";

export const getTasksByProject = (projectId: number) =>
  api.get(`/tasks/project/${projectId}/`);

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
