// src/api/api.ts
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
});

// attach token from localStorage or sessionStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(email: string, password: string) {
  // Laravel returns: { message, data: { user, token } }
  const res = await api.post("/login", { email, password });
  return res.data;
}

export async function register(formData: FormData) {
  const res = await api.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function logout() {
  // optional: call backend logout to invalidate token
  try {
    await api.post("/logout");
  } catch (e) {
    // ignore server error, we still clear client storage
  }
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default api;
