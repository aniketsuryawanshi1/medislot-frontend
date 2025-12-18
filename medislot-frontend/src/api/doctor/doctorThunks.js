import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../services/authService";

// Doctor Profiles
export const getDoctorProfiles = createAsyncThunk(
  "doctor/getProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("doctors/profiles/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profiles"
      );
    }
  }
);

export const createDoctorProfile = createAsyncThunk(
  "doctor/createProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("doctors/profiles/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create profile"
      );
    }
  }
);

export const getDoctorProfileById = createAsyncThunk(
  "doctor/getProfileById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`doctors/profiles/${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profile"
      );
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async ({ uuid, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(
        `doctors/profiles/${uuid}/`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update profile"
      );
    }
  }
);

export const deleteDoctorProfile = createAsyncThunk(
  "doctor/deleteProfile",
  async (uuid, { rejectWithValue }) => {
    try {
      await AxiosInstance.delete(`doctors/profiles/${uuid}/`);
      return uuid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete profile"
      );
    }
  }
);

// Doctor Schedules
export const getDoctorSchedules = createAsyncThunk(
  "doctor/getSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("doctors/schedules/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch schedules"
      );
    }
  }
);

export const createDoctorSchedule = createAsyncThunk(
  "doctor/createSchedule",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("doctors/schedules/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create schedule"
      );
    }
  }
);

export const getDoctorScheduleById = createAsyncThunk(
  "doctor/getScheduleById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`doctors/schedules/${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch schedule"
      );
    }
  }
);

export const updateDoctorSchedule = createAsyncThunk(
  "doctor/updateSchedule",
  async ({ uuid, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(
        `doctors/schedules/${uuid}/`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update schedule"
      );
    }
  }
);

export const deleteDoctorSchedule = createAsyncThunk(
  "doctor/deleteSchedule",
  async (uuid, { rejectWithValue }) => {
    try {
      await AxiosInstance.delete(`doctors/schedules/${uuid}/`);
      return uuid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete schedule"
      );
    }
  }
);

// Available Slots
export const getAvailableSlots = createAsyncThunk(
  "doctor/getAvailableSlots",
  async (params, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        "doctors/schedules/available-slots/",
        { params }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch slots"
      );
    }
  }
);

// Doctor Appointments
export const getDoctorAppointments = createAsyncThunk(
  "doctor/getAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("doctors/appointments/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch appointments"
      );
    }
  }
);

export const getDoctorAppointmentById = createAsyncThunk(
  "doctor/getAppointmentById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`doctors/appointments/${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch appointment"
      );
    }
  }
);

export const confirmAppointment = createAsyncThunk(
  "doctor/confirmAppointment",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `doctors/appointments/${uuid}/confirm/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to confirm appointment"
      );
    }
  }
);
