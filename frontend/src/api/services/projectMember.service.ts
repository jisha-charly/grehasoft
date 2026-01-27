import api from "../axios";

/* ================= PROJECT MEMBERS ================= */

export const getMembers = async (projectId: number) => {
  const res = await api.get(`projects/${projectId}/members/`);
  return res.data;
};

export const addMember = async (
  projectId: number,
  data: { user: number; role_in_project: string }
) => {
  await api.post(`projects/${projectId}/members/add/`, data);
};

export const updateMember = async (
  id: number,
  data: { role_in_project: string }
) => {
  await api.put(`project-members/${id}/update/`, data);
};

export const removeMember = async (id: number) => {
  await api.delete(`project-members/${id}/remove/`);
};
