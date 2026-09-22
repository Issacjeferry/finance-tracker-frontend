import axios from "axios";

// Read from environment variable with development and production fallbacks
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://finance-tracker-backend-j2il.onrender.com"
    : "http://localhost:8080");

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401/403 Unauthorized / Forbidden / Token Expiry / Missing User
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError =
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403 ||
        (error.response.status === 404 &&
          String(error.response.data?.error || "").toLowerCase().includes("user not found")));

    if (isAuthError) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.setItem(
          "auth_expired_message",
          "Your session has expired or is invalid. Please log in again."
        );
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;