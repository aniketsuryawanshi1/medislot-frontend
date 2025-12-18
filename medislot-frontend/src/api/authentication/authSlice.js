import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout, // <- ensure logout thunk is imported
  verifyOtp,
  resendOtp,
  requestPasswordReset,
  confirmPasswordReset,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./authThunks";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: [],
  isAuthenticated: !!localStorage.getItem("accessToken"),
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user =
          action.payload?.user || JSON.parse(localStorage.getItem("user"));
        state.isAuthenticated = !!localStorage.getItem("accessToken");
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        // still clear local state on failed remote logout if necessary
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })

      // VERIFY OTP
      .addCase(verifyOtp.fulfilled, (state, action) => {
        const payloadUser =
          action.payload?.user || JSON.parse(localStorage.getItem("user"));
        if (payloadUser) {
          state.user = payloadUser;
          state.isAuthenticated = !!localStorage.getItem("accessToken");
        }
        state.error = null;
      })

      // PASSWORD RESET / USERS
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u.id === action.payload.id || u.uuid === action.payload.uuid
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(
          (u) => u.id === action.payload.id || u.uuid === action.payload.uuid
        );
        if (idx !== -1) state.users[idx] = action.payload;
        if (
          state.user?.id === action.payload.id ||
          state.user?.uuid === action.payload.uuid
        )
          state.user = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (u) => u.id !== action.payload && u.uuid !== action.payload
        );
        if (
          state.user?.id === action.payload ||
          state.user?.uuid === action.payload
        ) {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      })

      // Generic rejected matcher
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          // keep existing error if payload absent
          state.error = action.payload || action.error?.message || state.error;
        }
      );
  },
});

export const { clearError, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
