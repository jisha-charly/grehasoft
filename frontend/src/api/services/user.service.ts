import api from "../axios";
import type { User } from "../../types/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users/");
  return res.data;
};

export const createUser = async (data: any) => {
  return api.post("/users/", data);
};

export const updateUser = async (id: number, data: any) => {
  return api.put(`/users/${id}/`, data);
};

export const deleteUser = async (id: number) => {
  return api.delete(`/users/${id}/`);
};
