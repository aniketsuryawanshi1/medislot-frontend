// src/services/authService.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import config from "../config/config";

const BASE_URL = config.apiBaseUrl;

// Get token from localStorage safely
export const getToken = (key) => {
  try {
    const token = localStorage.getItem(key);
    return token && token !== "undefined" && token !== "null" ? token : null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    // Add 30 second buffer before expiry
    return dayjs.unix(exp).subtract(30, "second").isBefore(dayjs());
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Axios instance
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
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

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers when token is refreshed
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Refresh token logic
export const refreshAccessToken = async () => {
  const refreshToken = getToken("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  if (isRefreshing) {
    // Return a promise that resolves when the token is refreshed
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.post(`${BASE_URL}auth/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;

    if (!newAccessToken) {
      throw new Error("No access token in refresh response");
    }

    localStorage.setItem("accessToken", newAccessToken);
    setAccessToken(newAccessToken);

    isRefreshing = false;
    onTokenRefreshed(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    isRefreshing = false;
    clearAuth();

    // Dispatch custom event for logout
    window.dispatchEvent(new CustomEvent("auth:logout"));

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
    // Skip token refresh for auth endpoints
    const isAuthEndpoint = request.url?.includes("/auth/");

    if (
      isAuthEndpoint &&
      (request.url?.includes("/login") ||
        request.url?.includes("/register") ||
        request.url?.includes("/token/refresh"))
    ) {
      return request;
    }

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
        console.error("Request interceptor: Token refresh failed", error);
        clearAuth();
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

    // Don't retry for auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");

    if (
      isAuthEndpoint &&
      (originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register"))
    ) {
      return Promise.reject(error);
    }

    // Handle 401 errors with token refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error(
          "Response interceptor: Token refresh failed",
          refreshError
        );
        clearAuth();
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
