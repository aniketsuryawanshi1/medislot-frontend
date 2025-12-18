import { createSlice } from "@reduxjs/toolkit";
import {
  getTelegramUsers,
  linkTelegramUser,
  getTelegramUserById,
  unlinkTelegramUser,
  getTelegramLogs,
  sendTelegramNotification,
} from "./telegramThunks";

const telegramSlice = createSlice({
  name: "telegram",
  initialState: {
    users: [],
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Users
    builder
      .addCase(getTelegramUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTelegramUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getTelegramUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(linkTelegramUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(getTelegramUserById.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u.uuid === action.payload.uuid
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(unlinkTelegramUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.uuid !== action.payload);
      });

    // Logs
    builder
      .addCase(getTelegramLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTelegramLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(getTelegramLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send Notification
    builder
      .addCase(sendTelegramNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendTelegramNotification.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendTelegramNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = telegramSlice.actions;
export default telegramSlice.reducer;
