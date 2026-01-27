import api from "../axios";
import type { User } from "../../types/user";

/* ---------------- USERS ---------------- */

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("users/");
  return res.data;
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: number;
  department: number;
}) => {
  await api.post("users/create/", data);
};

export const updateUser = async (
  id: number,
  data: {
    email: string;
    role: number;
    department: number | null;
    is_active: boolean;
  }
) => {
  await api.put(`users/${id}/update/`, data);
};

export const deleteUser = async (id: number) => {
  await api.delete(`users/${id}/delete/`);
};
