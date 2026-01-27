import api from "../axios";

/* ================= MILESTONES ================= */

export const getMilestones = async (projectId: number) => {
  const res = await api.get(`projects/${projectId}/milestones/`);
  return res.data;
};

export const addMilestone = async (
  projectId: number,
  data: { title: string; due_date: string }
) => {
  await api.post(`projects/${projectId}/milestones/create/`, data);
};

export const updateMilestone = async (
  id: number,
  data: Partial<any>
) => {
  await api.put(`milestones/${id}/update/`, data);
};

export const deleteMilestone = async (id: number) => {
  await api.delete(`milestones/${id}/delete/`);
};
