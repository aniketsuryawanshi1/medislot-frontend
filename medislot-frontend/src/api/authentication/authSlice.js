import { createSlice } from "@reduxjs/toolkit";
import {
  setAccessToken,
  clearAuth,
  initializeAuth,
} from "../../services/authService";
import {
  login,
  register,
  logout,
  verifyOtp,
  resendOtp,
  requestPasswordReset,
  confirmPasswordReset,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./authThunks";

// Initialize state based on authService
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: [],
  isAuthenticated: initializeAuth(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        setAccessToken(action.payload.access); // Set header via authService
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // Registration may not auto-login; handle OTP if needed
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        clearAuth();
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        setAccessToken(
          action.payload.access || localStorage.getItem("accessToken")
        );
      })
      .addCase(confirmPasswordReset.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        setAccessToken(
          action.payload.access || localStorage.getItem("accessToken")
        );
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u.uuid === action.payload.uuid
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u.uuid === action.payload.uuid
        );
        if (index !== -1) state.users[index] = action.payload;
        if (state.user?.uuid === action.payload.uuid)
          state.user = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.uuid !== action.payload);
        if (state.user?.uuid === action.payload) {
          state.user = null;
          state.isAuthenticated = false;
          clearAuth();
        }
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
