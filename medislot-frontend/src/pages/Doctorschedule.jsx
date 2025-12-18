import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Save,
  ArrowLeft,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const DoctorSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [schedules, setSchedules] = useState([]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const defaultSchedule = {
    day_of_week: "",
    start_time: "09:00",
    end_time: "17:00",
    break_start: "13:00",
    break_end: "14:00",
    is_available: true,
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.get("/api/doctors/schedules/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.length > 0) {
        setSchedules(response.data);
      } else {
        // Initialize with default schedules for all days
        setSchedules(
          daysOfWeek.map((day) => ({
            ...defaultSchedule,
            day_of_week: day,
            id: null, // null id means not created yet
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      // Initialize with default schedules on error
      setSchedules(
        daysOfWeek.map((day) => ({
          ...defaultSchedule,
          day_of_week: day,
          id: null,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    setSchedules(updatedSchedules);
    setError("");
  };

  const handleToggleAvailability = (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      is_available: !updatedSchedules[index].is_available,
    };
    setSchedules(updatedSchedules);
  };

  const validateSchedule = (schedule) => {
    if (!schedule.is_available) return true;

    if (!schedule.start_time || !schedule.end_time) {
      return "Start time and end time are required for available days";
    }

    if (schedule.start_time >= schedule.end_time) {
      return "End time must be after start time";
    }

    if (schedule.break_start && schedule.break_end) {
      if (schedule.break_start >= schedule.break_end) {
        return "Break end time must be after break start time";
      }
      if (
        schedule.break_start < schedule.start_time ||
        schedule.break_end > schedule.end_time
      ) {
        return "Break time must be within working hours";
      }
    }

    return true;
  };

  const handleSaveAll = async () => {
    // Validate all schedules
    for (let i = 0; i < schedules.length; i++) {
      const validation = validateSchedule(schedules[i]);
      if (validation !== true) {
        setError(`${schedules[i].day_of_week}: ${validation}`);
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("access_token");

      // Process each schedule
      for (const schedule of schedules) {
        const scheduleData = {
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          break_start: schedule.break_start || null,
          break_end: schedule.break_end || null,
          is_available: schedule.is_available,
        };

        if (schedule.id) {
          // Update existing schedule
          await axios.put(
            `/api/doctors/schedules/${schedule.id}/update/`,
            scheduleData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          // Create new schedule
          await axios.post("/api/doctors/schedules/create/", scheduleData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      setSuccess("Schedule saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      await fetchSchedules();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSetup = (preset) => {
    const presets = {
      weekdays: () => {
        const updated = schedules.map((schedule) => {
          const isWeekday = !["Saturday", "Sunday"].includes(
            schedule.day_of_week
          );
          return {
            ...schedule,
            is_available: isWeekday,
            start_time: "09:00",
            end_time: "17:00",
            break_start: "13:00",
            break_end: "14:00",
          };
        });
        setSchedules(updated);
      },
      allWeek: () => {
        const updated = schedules.map((schedule) => ({
          ...schedule,
          is_available: true,
          start_time: "09:00",
          end_time: "17:00",
          break_start: "13:00",
          break_end: "14:00",
        }));
        setSchedules(updated);
      },
      morning: () => {
        const updated = schedules.map((schedule) => {
          const isWeekday = !["Saturday", "Sunday"].includes(
            schedule.day_of_week
          );
          return {
            ...schedule,
            is_available: isWeekday,
            start_time: "08:00",
            end_time: "13:00",
            break_start: "",
            break_end: "",
          };
        });
        setSchedules(updated);
      },
      afternoon: () => {
        const updated = schedules.map((schedule) => {
          const isWeekday = !["Saturday", "Sunday"].includes(
            schedule.day_of_week
          );
          return {
            ...schedule,
            is_available: isWeekday,
            start_time: "14:00",
            end_time: "19:00",
            break_start: "",
            break_end: "",
          };
        });
        setSchedules(updated);
      },
    };

    presets[preset]();
    setSuccess("Quick setup applied! Click Save All to confirm.");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/doctor-dashboard")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 relative overflow-hidden">
            <svg
              className="absolute right-0 top-0 w-64 h-64 opacity-10"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <animate
                  attributeName="r"
                  values="60;70;60"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <path
                d="M100 50 L100 110 L130 130"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 100"
                  to="360 100 100"
                  dur="60s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>

            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Schedule Management
                  </h1>
                  <p className="text-blue-100">
                    Set your weekly availability for appointments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Quick Setup Buttons */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Quick Setup Templates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleQuickSetup("weekdays")}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all text-sm font-medium text-gray-700"
                >
                  Weekdays Only
                  <span className="block text-xs text-gray-500 mt-1">
                    Mon-Fri, 9AM-5PM
                  </span>
                </button>
                <button
                  onClick={() => handleQuickSetup("allWeek")}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all text-sm font-medium text-gray-700"
                >
                  Full Week
                  <span className="block text-xs text-gray-500 mt-1">
                    Mon-Sun, 9AM-5PM
                  </span>
                </button>
                <button
                  onClick={() => handleQuickSetup("morning")}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-400 transition-all text-sm font-medium text-gray-700"
                >
                  Morning Shift
                  <span className="block text-xs text-gray-500 mt-1">
                    Mon-Fri, 8AM-1PM
                  </span>
                </button>
                <button
                  onClick={() => handleQuickSetup("afternoon")}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-400 transition-all text-sm font-medium text-gray-700"
                >
                  Afternoon Shift
                  <span className="block text-xs text-gray-500 mt-1">
                    Mon-Fri, 2PM-7PM
                  </span>
                </button>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div
                  key={schedule.day_of_week}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    schedule.is_available
                      ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                      : "border-gray-200 bg-gradient-to-r from-gray-50 to-white"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Day Name & Toggle */}
                    <div className="md:w-48 flex items-center justify-between md:justify-start md:flex-col md:items-start">
                      <h3 className="text-xl font-bold text-gray-800">
                        {schedule.day_of_week}
                      </h3>
                      <button
                        onClick={() => handleToggleAvailability(index)}
                        className={`mt-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          schedule.is_available
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        {schedule.is_available ? "Available" : "Unavailable"}
                      </button>
                    </div>

                    {/* Time Inputs */}
                    {schedule.is_available ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Working Hours
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={schedule.start_time}
                              onChange={(e) =>
                                handleScheduleChange(
                                  index,
                                  "start_time",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={schedule.end_time}
                              onChange={(e) =>
                                handleScheduleChange(
                                  index,
                                  "end_time",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Break Time (Optional)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={schedule.break_start || ""}
                              onChange={(e) =>
                                handleScheduleChange(
                                  index,
                                  "break_start",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Start"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={schedule.break_end || ""}
                              onChange={(e) =>
                                handleScheduleChange(
                                  index,
                                  "break_end",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="End"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center py-4">
                        <p className="text-gray-500 italic">
                          Day off - No appointments will be accepted
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save All Schedules
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                📌 Important Notes:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Patients can only book appointments during your available
                  hours
                </li>
                <li>• Break times are excluded from appointment bookings</li>
                <li>
                  • Changes to your schedule will affect future bookings only
                </li>
                <li>
                  • Make sure to save all changes before leaving this page
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
