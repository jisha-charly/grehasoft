import api from "../axios";
import type { Client } from "../../types/clients";

export const getClients = async (): Promise<Client[]> => {
  const { data } = await api.get<Client[]>("clients/");
  return data;
};

export const createClient = (data: Partial<Client>) =>
  api.post("clients/create/", data);

export const updateClient = (id: number, data: Partial<Client>) =>
  api.put(`clients/${id}/update/`, data);

export const deleteClient = (id: number) =>
  api.delete(`clients/${id}/delete/`);
