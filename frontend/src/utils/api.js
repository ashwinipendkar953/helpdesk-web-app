import axios from "axios";

// Ensure the environment variable is loaded correctly
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
