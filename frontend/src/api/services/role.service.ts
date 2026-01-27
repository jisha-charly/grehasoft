import api from "../axios";
import type { Role } from "../../types/role";

/* ---------------- API CALLS ---------------- */

// ✅ GET all roles
export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get("/api/roles/");
  return res.data;
};

// ✅ CREATE role
export const createRole = async (data: {
  name: string;
  description: string;
}) => {
  const res = await api.post("/api/roles/create/", data);
  return res.data;
};

// ✅ DELETE role
export const deleteRole = async (id: number) => {
  const res = await api.delete(`/api/roles/${id}/delete/`);
  return res.data;
};
