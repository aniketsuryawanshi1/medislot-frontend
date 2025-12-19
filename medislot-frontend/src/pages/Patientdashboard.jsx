// src/pages/Patientdashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Bell,
  LogOut,
  Plus,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import usePatient from "../hooks/usePatient";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    profiles: patientProfiles,
    appointments,
    fetchProfiles,
    fetchAppointments,
    loading,
    error,
  } = usePatient();

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dataError, setDataError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (Array.isArray(appointments) && appointments.length > 0) {
      const now = new Date();
      const upcoming = appointments.filter((apt) => {
        try {
          const aptDate = new Date(apt.appointment_date);
          return aptDate >= now && apt.status !== "cancelled";
        } catch (err) {
          console.error("Error parsing appointment date:", err);
          return false;
        }
      });
      setUpcomingAppointments(upcoming);
    }
  }, [appointments]);

  const fetchDashboardData = async () => {
    try {
      setDataError("");
      await Promise.all([fetchProfiles(), fetchAppointments()]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setDataError("Failed to load dashboard data. Please refresh the page.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      // Force logout even if API call fails
      navigate("/login", { replace: true });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter((apt) => {
        const matchesSearch =
          apt.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          filterStatus === "all" || apt.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
    : [];

  if (loading && (!appointments || appointments.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayError = dataError || error;
  const userProfile =
    Array.isArray(patientProfiles) && patientProfiles.length > 0
      ? patientProfiles[0]
      : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg className="w-10 h-10" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#3B82F6" opacity="0.2">
                    <animate
                      attributeName="r"
                      values="18;20;18"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path
                    d="M20 8 L20 32 M8 20 L32 20"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MediSlot</h1>
                <p className="text-sm text-gray-600">Patient Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/notifications/logs")}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.full_name ||
                      userProfile?.user_full_name ||
                      "Patient"}
                  </p>
                  <p className="text-xs text-gray-600">Patient</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {displayError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{displayError}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back,{" "}
              {user?.full_name?.split(" ")[0] ||
                userProfile?.user_full_name?.split(" ")[0] ||
                "Patient"}
              !
            </h2>
            <p className="text-blue-100">
              Manage your health appointments with ease
            </p>
          </div>

          <svg
            className="absolute right-0 top-0 w-64 h-64 opacity-20"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <animate
                attributeName="r"
                values="80;90;80"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <animate
                attributeName="r"
                values="60;70;60"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M100 40 L100 160 M40 100 L160 100"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {Array.isArray(appointments) ? appointments.length : 0}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {upcomingAppointments.length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {Array.isArray(appointments)
                    ? appointments.filter((apt) => apt.status === "completed")
                        .length
                    : 0}
                </p>
              </div>
              <User className="w-12 h-12 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/appointments/book")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 flex items-center justify-center space-x-3 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all"
          >
            <Plus className="w-6 h-6" />
            <span className="font-semibold">Book New Appointment</span>
          </button>

          <button
            onClick={() => navigate("/waiting-list")}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg p-6 flex items-center justify-center space-x-3 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all"
          >
            <Clock className="w-6 h-6" />
            <span className="font-semibold">Join Waiting List</span>
          </button>

          <button
            onClick={() => navigate("/patient/profile")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg p-6 flex items-center justify-center space-x-3 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all"
          >
            <User className="w-6 h-6" />
            <span className="font-semibold">My Profile</span>
          </button>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-2xl font-bold text-gray-800">
              My Appointments
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No appointments found</p>
              <button
                onClick={() => navigate("/appointments/book")}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id || appointment.uuid}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Dr. {appointment.doctor_name || "Unknown"}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status?.charAt(0).toUpperCase() +
                            appointment.status?.slice(1) || "Unknown"}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>
                            {appointment.appointment_date
                              ? new Date(
                                  appointment.appointment_date
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Date not available"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>
                            {appointment.start_time || "00:00"} -{" "}
                            {appointment.end_time || "00:00"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">
                            {appointment.service_type || "Service"}
                          </span>
                        </div>

                        {appointment.notes && (
                          <p className="text-gray-500 italic mt-2">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {appointment.status === "pending" && (
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                          Cancel Appointment
                        </button>
                      )}
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
