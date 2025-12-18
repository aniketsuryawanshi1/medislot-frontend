import { isTokenExpired, getToken } from "../../services/authService";

// Check if user is authenticated (uses authService logic)
export const isAuthenticated = () => {
  const token = getToken("accessToken");
  return token && !isTokenExpired(token);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Validate email format (basic utility)
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
