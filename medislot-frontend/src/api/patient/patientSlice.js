import { createSlice } from "@reduxjs/toolkit";
import {
  getPatientProfiles,
  createPatientProfile,
  getPatientProfileById,
  updatePatientProfile,
  deletePatientProfile,
  getPatientAppointments,
  createPatientAppointment,
  getPatientAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getWaitingList,
  joinWaitingList,
  getWaitingListEntryById,
  removeWaitingListEntry,
} from "./patientThunks";

const patientSlice = createSlice({
  name: "patient",
  initialState: {
    profiles: [],
    appointments: [],
    waitingList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Profiles
    builder
      .addCase(getPatientProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(getPatientProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPatientProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
      })
      .addCase(getPatientProfileById.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(
          (p) => p.uuid === action.payload.uuid
        );
        if (index !== -1) state.profiles[index] = action.payload;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(
          (p) => p.uuid === action.payload.uuid
        );
        if (index !== -1) state.profiles[index] = action.payload;
      })
      .addCase(deletePatientProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(
          (p) => p.uuid !== action.payload
        );
      });

    // Appointments
    builder
      .addCase(getPatientAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPatientAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(getPatientAppointmentById.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (a) => a.uuid === action.payload.uuid
        );
        if (index !== -1) state.appointments[index] = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (a) => a.uuid === action.payload.uuid
        );
        if (index !== -1) state.appointments[index] = action.payload;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (a) => a.uuid === action.payload.uuid
        );
        if (index !== -1) state.appointments[index] = action.payload;
      });

    // Waiting List
    builder
      .addCase(getWaitingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWaitingList.fulfilled, (state, action) => {
        state.loading = false;
        state.waitingList = action.payload;
      })
      .addCase(getWaitingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinWaitingList.fulfilled, (state, action) => {
        state.waitingList.push(action.payload);
      })
      .addCase(getWaitingListEntryById.fulfilled, (state, action) => {
        const index = state.waitingList.findIndex(
          (w) => w.uuid === action.payload.uuid
        );
        if (index !== -1) state.waitingList[index] = action.payload;
      })
      .addCase(removeWaitingListEntry.fulfilled, (state, action) => {
        state.waitingList = state.waitingList.filter(
          (w) => w.uuid !== action.payload
        );
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;
