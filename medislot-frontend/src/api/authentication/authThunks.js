import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../services/authService";
import { clearUser } from "./authSlice";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("register/", userData);
      // Map backend response to expected Redux state
      return {
        user: {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
        },
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Registration failed"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("login/", credentials);
      // Map backend response to expected Redux state
      return {
        user: {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
        },
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Login failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState, dispatch }) => {
    try {
      const { refreshToken } = getState().auth;
      if (refreshToken) {
        await AxiosInstance.post("logout/", { refresh_token: refreshToken });
      }
    } catch {
      // Ignore errors on logout
    }
    dispatch(clearUser());
  }
);
