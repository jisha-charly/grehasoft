import api from "./axios";

/* ================= PROJECTS ================= */
export const getProjects = () => api.get("projects/");
export const createProject = (data: any) =>
  api.post("projects/create/", data);

export const updateProject = (id: number, data: any) =>
  api.put(`projects/${id}/update/`, data);

export const deleteProject = (id: number) =>
  api.delete(`projects/${id}/delete/`);


/* ================= MILESTONES ================= */
export const getMilestones = (projectId: number) =>
  api.get(`projects/${projectId}/milestones/`);

export const addMilestone = (projectId: number, data: any) =>
  api.post(`projects/${projectId}/milestones/create/`, data);

export const updateMilestone = (id: number, data: any) =>
  api.put(`milestones/${id}/update/`, data);

export const deleteMilestone = (id: number) =>
  api.delete(`milestones/${id}/delete/`);


/* ================= MEMBERS ================= */
export const getMembers = (projectId: number) =>
  api.get(`projects/${projectId}/members/`);

export const addMember = (projectId: number, data: any) =>
  api.post(`projects/${projectId}/members/add/`, data);

export const updateMember = (id: number, data: any) =>
  api.put(`project-members/${id}/update/`, data);

export const removeMember = (id: number) =>
  api.delete(`project-members/${id}/remove/`);
