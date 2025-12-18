import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Bell,
  LogOut,
  Settings,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      // Fetch doctor profile
      const profileResponse = await axios.get("/api/doctors/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorProfile(profileResponse.data);

      // Fetch appointments
      const appointmentsResponse = await axios.get(
        "/api/doctors/appointments/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(appointmentsResponse.data);

      // Calculate stats
      const appointmentStats = {
        total: appointmentsResponse.data.length,
        confirmed: appointmentsResponse.data.filter(
          (apt) => apt.status === "confirmed"
        ).length,
        pending: appointmentsResponse.data.filter(
          (apt) => apt.status === "pending"
        ).length,
        cancelled: appointmentsResponse.data.filter(
          (apt) => apt.status === "cancelled"
        ).length,
        completed: appointmentsResponse.data.filter(
          (apt) => apt.status === "completed"
        ).length,
      };
      setStats(appointmentStats);

      // Filter today's appointments
      const today = new Date().toISOString().split("T")[0];
      const todayApts = appointmentsResponse.data.filter(
        (apt) => apt.appointment_date === today && apt.status !== "cancelled"
      );
      setTodayAppointments(todayApts);

      // Fetch schedules
      const schedulesResponse = await axios.get("/api/doctors/schedules/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedulesResponse.data);

      // Fetch waiting list
      const waitingListResponse = await axios.get(
        "/api/doctors/waiting-list/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWaitingList(
        waitingListResponse.data.filter((item) => !item.is_notified)
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `/api/doctors/appointments/${appointmentId}/confirm/`,
        {
          status: "confirmed",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchDashboardData();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      await axios.post("/api/auth/logout/", { refresh_token: refreshToken });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate("/login");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg className="w-10 h-10" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#8B5CF6" opacity="0.2">
                    <animate
                      attributeName="r"
                      values="18;20;18"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path
                    d="M20 8 L20 32 M8 20 L32 20"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MediSlot</h1>
                <p className="text-sm text-gray-600">Doctor Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {waitingList.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {waitingList.length}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    Dr. {doctorProfile?.user_full_name || "Doctor"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {doctorProfile?.specialty || "Specialist"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, Dr.{" "}
              {doctorProfile?.user_full_name?.split(" ")[0] || "Doctor"}!
            </h2>
            <p className="text-purple-100">
              Here's your practice overview for today
            </p>
          </div>

          {/* Animated Background Elements */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.total}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.confirmed}
                </p>
              </div>
              <Activity className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cancelled</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.cancelled}
                </p>
              </div>
              <Users className="w-12 h-12 text-red-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.completed}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate("/doctor-schedule")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 flex items-center justify-center space-x-3 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all"
          >
            <Clock className="w-6 h-6" />
            <span className="font-semibold">Manage Schedule</span>
          </button>

          <button
            onClick={() => navigate("/doctor-appointments")}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg p-6 flex items-center justify-center space-x-3 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all"
          >
            <Calendar className="w-6 h-6" />
            <span className="font-semibold">View All Appointments</span>
          </button>

          <button
            onClick={() => navigate("/doctor-profile")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg p-6 flex items-center justify-center space-x-3 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all"
          >
            <Settings className="w-6 h-6" />
            <span className="font-semibold">Profile Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Today's Appointments
            </h3>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No appointments scheduled for today
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {appointment.patient_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.service_type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-green-600" />
                        <span>
                          {appointment.start_time} - {appointment.end_time}
                        </span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Note: {appointment.notes}
                      </p>
                    )}

                    {appointment.status === "pending" && (
                      <button
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Confirm Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waiting List & Schedule Overview */}
          <div className="space-y-6">
            {/* Waiting List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                Waiting List
                {waitingList.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {waitingList.length}
                  </span>
                )}
              </h3>

              {waitingList.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    No pending waiting list requests
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {waitingList.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-purple-50 to-pink-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-gray-800 text-sm">
                            {item.patient_name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {new Date(item.requested_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.requested_time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Schedule Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-green-600" />
                This Week's Schedule
              </h3>

              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No schedule set</p>
                  <button
                    onClick={() => navigate("/doctor-schedule")}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    Create Schedule →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`border rounded-lg p-3 ${
                        schedule.is_available
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 text-sm">
                          {schedule.day_of_week}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            schedule.is_available
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {schedule.is_available ? "Available" : "Off"}
                        </span>
                      </div>
                      {schedule.is_available && (
                        <p className="text-xs text-gray-600 mt-1">
                          {schedule.start_time} - {schedule.end_time}
                          {schedule.break_start && schedule.break_end && (
                            <span className="ml-2 text-gray-500">
                              (Break: {schedule.break_start} -{" "}
                              {schedule.break_end})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
