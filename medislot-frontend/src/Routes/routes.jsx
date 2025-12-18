import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Auth & App Pages
import {
  Login,
  Register,
  VerifyOtp,
  Appointmentbooking,
  Doctordashboard,
  Notificationlogs,
  Passwordresetconfirm,
  Passwordresetrequest,
  Patientdashboard,
  Patientprofile,
  Telegramintegration,
  Waitinglist,
} from "../pages";

const MainRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/password-reset" element={<Passwordresetrequest />} />
    <Route
      path="/password-reset-confirm/:uid/:token"
      element={<Passwordresetconfirm />}
    />

    {/* Default Route */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Protected Routes (wrap with PrivateRoute) */}
    <Route
      path="/doctor/dashboard"
      element={
        <PrivateRoute>
          <Doctordashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/doctor/appointments"
      element={
        <PrivateRoute>
          <Appointmentbooking />{" "}
          {/* Placeholder; create a dedicated DoctorAppointments page if needed */}
        </PrivateRoute>
      }
    />
    <Route
      path="/doctor/schedule"
      element={
        <PrivateRoute>
          <div>Doctor Schedule Page (Create this component)</div>{" "}
          {/* Placeholder */}
        </PrivateRoute>
      }
    />
    <Route
      path="/doctor/profile"
      element={
        <PrivateRoute>
          <Patientprofile /> {/* Placeholder; create DoctorProfile if needed */}
        </PrivateRoute>
      }
    />
    <Route
      path="/patient/dashboard"
      element={
        <PrivateRoute>
          <Patientdashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/patient/profile"
      element={
        <PrivateRoute>
          <Patientprofile />
        </PrivateRoute>
      }
    />
    <Route
      path="/appointments/book"
      element={
        <PrivateRoute>
          <Appointmentbooking />
        </PrivateRoute>
      }
    />
    <Route
      path="/waiting-list"
      element={
        <PrivateRoute>
          <Waitinglist />
        </PrivateRoute>
      }
    />
    <Route
      path="/notifications/logs"
      element={
        <PrivateRoute>
          <Notificationlogs />
        </PrivateRoute>
      }
    />
    <Route
      path="/telegram"
      element={
        <PrivateRoute>
          <Telegramintegration />
        </PrivateRoute>
      }
    />

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
