import api from "../axios";

export interface TaskComment {
  id: number;
  task: number;
  user: number;
  username: string;
  comment: string;
  created_at: string;
}

/* ===============================
   GET COMMENTS
================================= */
export const getTaskComments = async (
  taskId: number
): Promise<TaskComment[]> => {
  const res = await api.get(`/tasks/${taskId}/comments/`);
  return res.data;
};

/* ===============================
   ADD COMMENT
================================= */
export const addTaskComment = async (
  taskId: number,
  data: { comment: string }
): Promise<TaskComment> => {
  const res = await api.post(`/tasks/${taskId}/comments/`, data);
  return res.data;
};
