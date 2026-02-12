import api from "../axios";

export interface ActivityLog {
  id: number;
  action: string;
  description: string;
  user_name: string;
  created_at: string;
}

export const getTaskActivity = async (taskId: number) => {
  const res = await api.get(`/tasks/${taskId}/activity/`);
  return res.data;
};
