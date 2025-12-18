import { useDispatch, useSelector } from "react-redux";
import {
  login,
  register,
  logout as logoutThunk,
  verifyOtp,
  resendOtp,
} from "../api/authentication/authThunks";
import {
  clearError,
  setUser,
  logoutUser,
} from "../api/authentication/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth || {});

  return {
    // state
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,

    // actions (login returns a promise via unwrap)
    login: (credentials) => dispatch(login(credentials)),
    register: (data) => dispatch(register(data)),
    verifyOtp: (data) => dispatch(verifyOtp(data)),
    resendOtp: (data) => dispatch(resendOtp(data)),
    logout: () => {
      // clear storage + state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      dispatch(logoutThunk());
      dispatch(logoutUser());
    },
    clearError: () => dispatch(clearError()),
    setUser: (u) => dispatch(setUser(u)),
  };
};

export default useAuth;
