import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Lock } from "lucide-react";
import useAuth from "../hooks/useAuth";

const PasswordResetRequest = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth(); // Added hook
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await requestPasswordReset(email); // Use thunk instead of axios

      setSuccess(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Check Your Email
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-gray-700 text-sm">
                We've sent a password reset link to
              </p>
              <p className="text-blue-600 font-semibold mt-2">{email}</p>
            </div>

            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Next Steps:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">1.</span>
                  <span>Check your email inbox (and spam folder)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">2.</span>
                  <span>Click the reset link in the email</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">3.</span>
                  <span>Set your new password</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Back to Login
              </button>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Send another reset link
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              The reset link will expire in 1 hour
            </p>
          </div>
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
            <circle cx="200" cy="200" r="150" fill="white">
              <animate
                attributeName="r"
                values="150;160;150"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M200 100 L200 300 M100 200 L300 200"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="200" cy="150" r="30" fill="white" />
            <rect x="170" y="190" width="60" height="80" fill="white" rx="5" />
          </svg>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Forgot Your Password?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              No worries! Enter your email and we'll send you instructions to
              reset your password.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-semibold">Secure Process</p>
                  <p className="text-sm text-blue-100">
                    Your security is our priority
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-semibold">Email Verification</p>
                  <p className="text-sm text-blue-100">
                    Reset link sent to your email
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-semibold">Quick & Easy</p>
                  <p className="text-sm text-blue-100">
                    Back to your account in minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 md:w-1/2">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter your email to receive reset instructions
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send a password reset link to this email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
