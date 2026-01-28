import api from "../axios";
import type { Role } from "../../types/role";

/// GET all roles
export const getRoles = async () => {
  const res = await api.get("/roles/");
  return res.data;
};

// CREATE role
export const createRole = async (data: {
  name: string;
  description: string;
}) => {
 const res = await api.post(
    "https://grehasoft-production.up.railway.app/api/roles/create/",
    data
  );
  return res.data;
};

// DELETE role
export const deleteRole = async (id: number) => {
  const res = await api.delete(`/roles/${id}/delete/`);
  return res.data;
};

