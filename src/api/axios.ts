import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (attach token)
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor (optional, scalable)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // optional: auto logout later
      console.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default api;
