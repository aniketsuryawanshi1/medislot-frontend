import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Auth Pages
import { Login, Register, VerifyOtp } from "../pages";
const MainRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Default Route */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/verify-otp" element={<VerifyOtp />} />

    {/* 404 Page */}
    <Route
      path="*"
      element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="text-xl text-gray-600 mt-4">Page not found</p>
          </div>
        </div>
      }
    />
  </Routes>
);

export default MainRoutes;
