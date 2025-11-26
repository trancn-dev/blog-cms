import axios from "axios";
import { toast } from "vue3-toastify";

// Create axios instance
const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000") +
    (import.meta.env.VITE_API_PREFIX || "/api/v1/admin"),
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to get error message
const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstKey = Object.keys(errors)[0];
    return Array.isArray(errors[firstKey])
      ? errors[firstKey][0]
      : errors[firstKey];
  }
  return error.message || "An error occurred";
};

// Response interceptor - only handle errors, no auto success toast
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = getErrorMessage(error);

    if (error.response) {
      // Handle 401 - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject({ error, message: errorMessage });
  }
);

export default apiClient;
export { toast };
