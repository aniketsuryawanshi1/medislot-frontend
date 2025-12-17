import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../api/authentication/authThunks";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );
  const register = useCallback(
    (data) => dispatch(registerUser(data)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuth;
