import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../services/authService";

// Telegram Users
export const getTelegramUsers = createAsyncThunk(
  "telegram/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("telegram/users/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch users"
      );
    }
  }
);

export const linkTelegramUser = createAsyncThunk(
  "telegram/linkUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("telegram/users/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to link user"
      );
    }
  }
);

export const getTelegramUserById = createAsyncThunk(
  "telegram/getUserById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`telegram/users/${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch user"
      );
    }
  }
);

export const unlinkTelegramUser = createAsyncThunk(
  "telegram/unlinkUser",
  async (uuid, { rejectWithValue }) => {
    try {
      await AxiosInstance.delete(`telegram/users/${uuid}/`);
      return uuid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to unlink user"
      );
    }
  }
);

// Logs
export const getTelegramLogs = createAsyncThunk(
  "telegram/getLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("telegram/logs/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch logs"
      );
    }
  }
);

// Send Notification
export const sendTelegramNotification = createAsyncThunk(
  "telegram/sendNotification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("telegram/send/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to send notification"
      );
    }
  }
);
