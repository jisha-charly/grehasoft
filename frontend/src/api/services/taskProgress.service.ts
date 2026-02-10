import api from "../axios";
import type { TaskStatus } from "../../types/task";

export const addTaskProgress = async (
  taskId: number,
  data: {
    status: TaskStatus;
    comment: string;
  }
) => {
  const res = await api.post(
    `/tasks/${taskId}/progress/add/`,
    data
  );
  return res.data;
};

export const getTaskProgress = async (taskId: number) => {
  const res = await api.get(
    `/tasks/${taskId}/progress/`
  );
  return res.data;
};
