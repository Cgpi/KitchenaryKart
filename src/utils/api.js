import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach admin JWT if present
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalise errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired — let each component decide how to react
      window.dispatchEvent(new Event("sessionExpired"));
    }
    return Promise.reject(error);
  }
);

export default api;
