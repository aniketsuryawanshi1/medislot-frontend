import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../services/authService";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/login/", credentials);
      const { access, refresh, user } = response.data;
      // Ensure user object includes role for navigation
      if (!user || !user.role) {
        throw new Error("Invalid user data received");
      }
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      return { user, access, refresh };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/register/", userData);
      // Assuming backend sends OTP and minimal response; handle if needed
      return response.data; // May include user or OTP instructions
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AxiosInstance.post("auth/logout/");
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Logout failed");
    }
  }
);

// Note: Token refresh is handled automatically by Axios interceptors in authService.js, so no manual thunk needed

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/verify-otp/", otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "OTP verification failed"
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/otp/resend/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Resend OTP failed"
      );
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("auth/password-reset/", {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Password reset request failed"
      );
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  "auth/confirmPasswordReset",
  async ({ uid, token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `auth/password-reset-confirm/${uid}/${token}/`,
        { new_password: newPassword }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Password reset confirm failed"
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
