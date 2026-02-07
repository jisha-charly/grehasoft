import api from "../axios";

/* ======================================================
   PROJECT MEMBERS SERVICE
   ====================================================== */

/**
 * Get all members of a project
 */
export const getMembers = async (projectId: number) => {
  const res = await api.get(`projects/${projectId}/members/`);
  return res.data;
};

/**
 * Add a member to a project
 */
export const addMember = async (
  projectId: number,
  data: {
    user: number;
    role_in_project: string;
  }
) => {
  const res = await api.post(`projects/${projectId}/members/add/`, data);
  return res.data;
};

/**
 * Update project member role
 */
export const updateMember = async (
  id: number,
  data: {
    role_in_project: string;
  }
) => {
  const res = await api.put(`project-members/${id}/update/`, data);
  return res.data;
};

/**
 * Remove member from project
 */
export const removeMember = async (id: number) => {
  const res = await api.delete(`project-members/${id}/remove/`);
  return res.data;
};
