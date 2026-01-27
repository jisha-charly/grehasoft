import api from "../axios";
import type { Department } from "../../types/department";

/* ---------------- API CALLS ---------------- */

export const getDepartments = async () => {
  const res = await api.get<Department[]>("departments/");
  return res.data;
};

export const createDepartment = async (data: {
  name: string;
  parent_id: number | null;
}) => {
  await api.post("departments/create/", data);
};

export const updateDepartment = async (
  id: number,
  data: { name: string; parent_id: number | null }
) => {
  await api.put(`departments/${id}/update/`, data);
};

export const deleteDepartment = async (id: number) => {
  await api.delete(`departments/${id}/delete/`);
};
