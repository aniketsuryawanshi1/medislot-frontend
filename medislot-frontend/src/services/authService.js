import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const BASE_URL = "http://localhost:8000/api/";

// Get token from localStorage safely
const getToken = (key) => {
  const token = localStorage.getItem(key);
  return token && token !== "undefined" ? token : null;
};

// Axios instance
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {},
});

// Set Authorization header globally
export const setAccessToken = (token) => {
  if (token) {
    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete AxiosInstance.defaults.headers.common["Authorization"];
  }
};

// Clear auth tokens
export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  setAccessToken(null);
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return dayjs.unix(exp).isBefore(dayjs());
  } catch (error) {
    return true;
  }
};

// Refresh token logic
export const refreshAccessToken = async () => {
  const refreshToken = getToken("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    // Fixed: Use the correct endpoint path
    const response = await axios.post(`${BASE_URL}auth/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearAuth();
    throw error;
  }
};

// Initialize auth on app start
export const initializeAuth = () => {
  const token = getToken("accessToken");
  if (token && !isTokenExpired(token)) {
    setAccessToken(token);
    return true;
  }
  return false;
};

// Request interceptor
AxiosInstance.interceptors.request.use(
  async (request) => {
    const token = getToken("accessToken");

    if (!token) {
      return request;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      try {
        const newToken = await refreshAccessToken();
        request.headers.Authorization = `Bearer ${newToken}`;
        return request;
      } catch (error) {
        clearAuth();
        // Don't redirect here, let the context handle it
        return Promise.reject(error);
      }
    } else {
      request.headers.Authorization = `Bearer ${token}`;
      return request;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401/403 errors
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        clearAuth();
        // Let the context handle logout
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Initialize auth when module loads
initializeAuth();

export default AxiosInstance;
