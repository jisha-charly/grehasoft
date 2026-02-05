import axios from "axios";
import { API_BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    // Set header safely on Axios config
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }

  return config;
});

console.log("API_BASE_URL =", API_BASE_URL);

export default api;
