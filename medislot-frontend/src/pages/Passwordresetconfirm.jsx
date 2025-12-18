import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const PasswordResetConfirm = () => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();
  const { confirmPasswordReset } = useAuth(); // Added hook
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray",
  });

  useEffect(() => {
    // Validate token on mount
    validateToken();
  }, []);

  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const validateToken = async () => {
    try {
      setValidating(true);
      // You can add a token validation endpoint if needed
      // For now, we'll assume the token is valid if it exists
      if (uidb64 && token) {
        setTokenValid(true);
      } else {
        setError("Invalid or missing reset link");
      }
    } catch (error) {
      setError("Invalid or expired reset link");
    } finally {
      setValidating(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "gray" });
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    const strength = {
      0: { message: "Very Weak", color: "red" },
      1: { message: "Weak", color: "red" },
      2: { message: "Fair", color: "orange" },
      3: { message: "Good", color: "yellow" },
      4: { message: "Strong", color: "green" },
      5: { message: "Very Strong", color: "green" },
    };

    setPasswordStrength({
      score,
      message: strength[score].message,
      color: strength[score].color,
      checks,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.password || !formData.password2) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Please choose a stronger password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await confirmPasswordReset({
        uidb64,
        token,
        password: formData.password,
        password2: formData.password2,
      }); // Use thunk
      setSuccess(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid && !validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <button
            onClick={() => navigate("/password-reset")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side - Illustration */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 md:w-1/2 flex flex-col justify-center relative overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 400 400"
          >
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="none"
              stroke="white"
              strokeWidth="4"
            >
              <animate
                attributeName="r"
                values="120;130;120"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="200"
              cy="200"
              r="80"
              fill="none"
              stroke="white"
              strokeWidth="4"
            >
              <animate
                attributeName="r"
                values="80;90;80"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <rect x="170" y="180" width="60" height="40" fill="white" rx="5" />
            <circle cx="200" cy="160" r="20" fill="white" />
          </svg>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Create New Password
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Your new password must be different from previously used
              passwords.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-1" />
                <div className="text-white">
                  <p className="font-semibold">Secure & Protected</p>
                  <p className="text-sm text-blue-100">
                    Your password is encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 md:w-1/2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-600">
              Choose a strong password for your account
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      Password Strength:
                    </span>
                    <span
                      className={`text-xs font-semibold text-${passwordStrength.color}-600`}
                    >
                      {passwordStrength.message}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Password must contain:
                    </p>
                    {passwordStrength.checks && (
                      <>
                        <div
                          className={`text-xs flex items-center ${
                            passwordStrength.checks.length
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordStrength.checks.length ? "✓" : "○"}
                          </span>
                          At least 8 characters
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            passwordStrength.checks.uppercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordStrength.checks.uppercase ? "✓" : "○"}
                          </span>
                          One uppercase letter
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            passwordStrength.checks.lowercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordStrength.checks.lowercase ? "✓" : "○"}
                          </span>
                          One lowercase letter
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            passwordStrength.checks.number
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordStrength.checks.number ? "✓" : "○"}
                          </span>
                          One number
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            passwordStrength.checks.special
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordStrength.checks.special ? "✓" : "○"}
                          </span>
                          One special character
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.password2 &&
                formData.password !== formData.password2 && (
                  <p className="text-xs text-red-600 mt-1">
                    Passwords do not match
                  </p>
                )}
              {formData.password2 &&
                formData.password === formData.password2 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passwords match
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading || passwordStrength.score < 3}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
