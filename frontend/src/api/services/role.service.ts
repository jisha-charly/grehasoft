import api from "../axios";
import type { Role } from "../../types/role";

/// GET all roles
export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get<Role[]>("/roles/");
  return res.data;
};

// CREATE role
export const createRole = async (
  data: Pick<Role, "name" | "description">
): Promise<Role> => {
  const res = await api.post<Role>("/roles/create/", data);
  return res.data;
};
// UPDATE role ✅
export const updateRole = async (
  id: number,
  data: Pick<Role, "name" | "description">
): Promise<Role> => {
  const res = await api.put<Role>(`/roles/${id}/update/`, data);
  return res.data;
};
// DELETE role
export const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}/delete/`);
};
