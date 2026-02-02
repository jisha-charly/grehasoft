import axios from "axios";
import { API_BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    // ✅ Axios v1 safe way
    config.headers?.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default api;
