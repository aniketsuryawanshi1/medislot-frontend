import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../services/authService";

// Patient Profiles
export const getPatientProfiles = createAsyncThunk(
  "patient/getProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("patients/profiles/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profiles"
      );
    }
  }
);

export const createPatientProfile = createAsyncThunk(
  "patient/createProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("patients/profiles/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create profile"
      );
    }
  }
);

export const getPatientProfileById = createAsyncThunk(
  "patient/getProfileById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`patients/profiles/${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profile"
      );
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  "patient/updateProfile",
  async ({ uuid, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(
        `patients/profiles/${uuid}/`,
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

export const deletePatientProfile = createAsyncThunk(
  "patient/deleteProfile",
  async (uuid, { rejectWithValue }) => {
    try {
      await AxiosInstance.delete(`patients/profiles/${uuid}/`);
      return uuid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete profile"
      );
    }
  }
);

// Patient Appointments
export const getPatientAppointments = createAsyncThunk(
  "patient/getAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("patients/appointments/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch appointments"
      );
    }
  }
);

export const createPatientAppointment = createAsyncThunk(
  "patient/createAppointment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("patients/appointments/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to book appointment"
      );
    }
  }
);

export const getPatientAppointmentById = createAsyncThunk(
  "patient/getAppointmentById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `patients/appointments/${uuid}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch appointment"
      );
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "patient/cancelAppointment",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `patients/appointments/${uuid}/cancel/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to cancel appointment"
      );
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  "patient/rescheduleAppointment",
  async ({ uuid, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `patients/appointments/${uuid}/reschedule/`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to reschedule appointment"
      );
    }
  }
);

// Waiting List
export const getWaitingList = createAsyncThunk(
  "patient/getWaitingList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("patients/waiting-list/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch waiting list"
      );
    }
  }
);

export const joinWaitingList = createAsyncThunk(
  "patient/joinWaitingList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post("patients/waiting-list/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to join waiting list"
      );
    }
  }
);

export const getWaitingListEntryById = createAsyncThunk(
  "patient/getWaitingListEntryById",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `patients/waiting-list/${uuid}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch waiting list entry"
      );
    }
  }
);

export const removeWaitingListEntry = createAsyncThunk(
  "patient/removeWaitingListEntry",
  async (uuid, { rejectWithValue }) => {
    try {
      await AxiosInstance.delete(`patients/waiting-list/${uuid}/`);
      return uuid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to remove waiting list entry"
      );
    }
  }
);
