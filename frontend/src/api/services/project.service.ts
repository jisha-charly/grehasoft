import api from "../axios";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "../../types/project";

export const getProjects = async () => {
  const res = await api.get<Project[]>("projects/");
  return res.data;
};

export const getProjectById = async (id: number) => {
  const res = await api.get<Project>(`projects/${id}/`);
  return res.data;
};

export const createProject = async (data: CreateProjectPayload) => {
  await api.post("projects/create/", data);
};

export const updateProject = async (
  id: number,
  data: UpdateProjectPayload
) => {
  await api.put(`projects/${id}/update/`, data);
};
