import { createSlice } from "@reduxjs/toolkit";
import {
  getDoctorProfiles,
  createDoctorProfile,
  getDoctorProfileById,
  updateDoctorProfile,
  deleteDoctorProfile,
  getDoctorSchedules,
  createDoctorSchedule,
  getDoctorScheduleById,
  updateDoctorSchedule,
  deleteDoctorSchedule,
  getAvailableSlots,
  getDoctorAppointments,
  getDoctorAppointmentById,
  confirmAppointment,
} from "./doctorThunks";

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    profiles: [],
    schedules: [],
    availableSlots: [],
    appointments: [],
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
      .addCase(getDoctorProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctorProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(getDoctorProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDoctorProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
      })
      .addCase(getDoctorProfileById.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(
          (p) => p.uuid === action.payload.uuid
        );
        if (index !== -1) state.profiles[index] = action.payload;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(
          (p) => p.uuid === action.payload.uuid
        );
        if (index !== -1) state.profiles[index] = action.payload;
      })
      .addCase(deleteDoctorProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(
          (p) => p.uuid !== action.payload
        );
      });

    // Schedules
    builder
      .addCase(getDoctorSchedules.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctorSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(getDoctorSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDoctorSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })
      .addCase(getDoctorScheduleById.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (s) => s.uuid === action.payload.uuid
        );
        if (index !== -1) state.schedules[index] = action.payload;
      })
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (s) => s.uuid === action.payload.uuid
        );
        if (index !== -1) state.schedules[index] = action.payload;
      })
      .addCase(deleteDoctorSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (s) => s.uuid !== action.payload
        );
      });

    // Available Slots
    builder
      .addCase(getAvailableSlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Appointments
    builder
      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDoctorAppointmentById.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (a) => a.uuid === action.payload.uuid
        );
        if (index !== -1) state.appointments[index] = action.payload;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (a) => a.uuid === action.payload.uuid
        );
        if (index !== -1) state.appointments[index] = action.payload;
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer;
