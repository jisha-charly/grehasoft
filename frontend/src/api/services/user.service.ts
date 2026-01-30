import api from "../axios";
import type { User } from "../../types/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users/");
  return res.data; // ✅ must be array
};

export const createUser = async (data: any) => {
  return api.post("/users/create/", data);
};

export const updateUser = async (id: number, data: any) => {
  return api.put(`/users/${id}/update/`, data);
};

export const deleteUser = async (id: number) => {
  return api.delete(`/users/${id}/delete/`);
};
