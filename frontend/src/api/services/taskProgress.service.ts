import api from "../axios";

export const getTaskProgress = async (taskId: number) => {
  const res = await api.get(`/tasks/${taskId}/progress/`);
  return res.data; // ✅ return actual array
};

export const addTaskProgress = async (
  taskId: number,
  data: { progress: number; note: string }
) => {
  const res = await api.post(`/tasks/${taskId}/progress/add/`, data);
  return res.data;
};
