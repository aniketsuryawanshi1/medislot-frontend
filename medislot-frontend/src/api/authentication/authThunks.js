import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance, { setAccessToken } from "../../services/authService";

// LOGIN - handle various backend token/key shapes and top-level user fields
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/login/", credentials);
      const data = response.data || {};

      // Accept multiple possible token key names from backend
      const access =
        data.access || data.access_token || data.accessToken || data.token;
      const refresh =
        data.refresh || data.refresh_token || data.refreshToken || data.refresh;

      // Build user object (support both data.user and top-level fields)
      const user =
        data.user ||
        (data.username || data.email
          ? {
              username: data.username,
              email: data.email,
              full_name: data.full_name || data.user_full_name || "",
              role: data.role || data.user_role || undefined,
            }
          : null);

      // Persist tokens & user in localStorage under app-expected keys
      if (access) {
        localStorage.setItem("accessToken", access);
        setAccessToken(access);
      }
      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Return normalized payload
      return { user, access, refresh, raw: data };
    } catch (error) {
      // prefer backend error object if present
      const payload = error.response?.data || error.message || "Login failed";
      return rejectWithValue(payload);
    }
  }
);

// REGISTER - keep as-is but return backend data
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/register/", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Registration failed"
      );
    }
  }
);

// VERIFY OTP - allow tokens returned here too
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/verify-otp/", payload);
      const data = response.data || {};

      const access =
        data.access || data.access_token || data.accessToken || data.token;
      const refresh =
        data.refresh || data.refresh_token || data.refreshToken || data.refresh;

      const user =
        data.user ||
        (data.username || data.email
          ? {
              username: data.username,
              email: data.email,
              full_name: data.full_name || data.user_full_name || "",
              role: data.role || data.user_role || undefined,
            }
          : null);

      if (access) {
        localStorage.setItem("accessToken", access);
        setAccessToken(access);
      }
      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { user, access, refresh, raw: data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "OTP verification failed"
      );
    }
  }
);

// LOGOUT thunk should exist and be exported from this file (if not, implement it)
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Try remote logout; ignore errors but clear local storage
      await AxiosInstance.post("auth/logout/").catch(() => {});
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      // unset header via authService
      setAccessToken(null);
      return {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Logout failed"
      );
    }
  }
);

// Note: Token refresh is handled automatically by Axios interceptors in authService.js, so no manual thunk needed

// RESEND OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/otp/resend/", data); // Matches backend endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Resend OTP failed"
      );
    }
  }
);

// REQUEST PASSWORD RESET
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/password-reset/", {
        email,
      }); // Matches Passwordresetrequest.jsx
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Password reset request failed"
      );
    }
  }
);

// CONFIRM PASSWORD RESET
export const confirmPasswordReset = createAsyncThunk(
  "auth/confirmPasswordReset",
  async ({ uidb64, token, password, password2 }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        "auth/password-reset-confirm/",
        {
          uidb64,
          token,
          password,
          password2,
        }
      ); // Matches Passwordresetconfirm.jsx
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Password reset confirm failed"
      );
    }
  }
);

export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("auth/users/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch users"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`auth/user/${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ uuid, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`auth/user/${uuid}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (uuid, { rejectWithValue }) => {
    try {
      await AxiosInstance.delete(`auth/user/${uuid}/`);
      return uuid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete user"
      );
    }
  }
);
