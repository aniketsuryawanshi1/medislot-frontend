import { useDispatch, useSelector } from "react-redux";
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
} from "../api/authentication/authThunks";
import {
  clearError,
  setUser,
  logoutUser,
} from "../api/authentication/authSlice";
import {
  isAuthenticated as checkAuth,
  getCurrentUser,
} from "../api/authentication/authUtils";

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return {
    // State
    user: authState.user,
    users: authState.users,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,

    // Utility checks (prefer Redux state over localStorage for consistency)
    isAuthenticated: authState.isAuthenticated || checkAuth(),
    currentUser: authState.user || getCurrentUser(),

    // Actions
    login: (credentials) => dispatch(login(credentials)),
    register: (userData) => dispatch(register(userData)),
    logout: () => dispatch(logout()),
    verifyOtp: (otpData) => dispatch(verifyOtp(otpData)),
    resendOtp: (data) => dispatch(resendOtp(data)),
    requestPasswordReset: (email) => dispatch(requestPasswordReset(email)),
    confirmPasswordReset: (data) => dispatch(confirmPasswordReset(data)),
    fetchUsers: () => dispatch(getUsers()),
    fetchUserById: (uuid) => dispatch(getUserById(uuid)),
    updateUser: (uuid, data) => dispatch(updateUser({ uuid, data })),
    deleteUser: (uuid) => dispatch(deleteUser(uuid)),

    // Slice actions
    clearError: () => dispatch(clearError()),
    setUser: (user) => dispatch(setUser(user)),
    logoutUser: () => dispatch(logoutUser()),
  };
};

export default useAuth;
