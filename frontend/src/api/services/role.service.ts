import api from "../axios";
import type { Role } from "../../types/role";

/* ---------------- API CALLS ---------------- */

export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get("/roles/");
  return res.data;
};

export const createRole = async (data: {
  name: string;
  description: string;
}) => {
  await api.post("/roles/create/", data);
};

export const deleteRole = async (id: number) => {
  await api.delete(`/roles/${id}/delete/`);
};
