import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  User,
  Calendar,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Search,
  Trash2,
} from "lucide-react";
import axios from "axios";

const WaitingList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    requested_date: "",
    requested_time: "",
    notes: "",
  });

  useEffect(() => {
    fetchDoctors();
    fetchWaitingList();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("/api/doctors/list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchWaitingList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get("/api/patients/waiting-list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWaitingList(response.data);
    } catch (error) {
      console.error("Error fetching waiting list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowForm(true);
    setError("");
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

    if (!selectedDoctor) {
      setError("Please select a doctor");
      return;
    }

    if (!formData.requested_date || !formData.requested_time) {
      setError("Please provide requested date and time");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("access_token");

      const waitingListData = {
        doctor: selectedDoctor.id,
        requested_date: formData.requested_date,
        requested_time: formData.requested_time,
        notes: formData.notes,
      };

      await axios.post("/api/patients/waiting-list/add/", waitingListData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Successfully added to waiting list!");
      setFormData({ requested_date: "", requested_time: "", notes: "" });
      setSelectedDoctor(null);
      setShowForm(false);

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      await fetchWaitingList();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to add to waiting list"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove yourself from this waiting list?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`/api/patients/waiting-list/${id}/remove/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Removed from waiting list");
      setTimeout(() => setSuccess(""), 3000);
      await fetchWaitingList();
    } catch (error) {
      setError("Failed to remove from waiting list");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/patient-dashboard")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add to Waiting List Section */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 relative overflow-hidden">
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
                  d="M100 40 L100 160 M40 100 L160 100"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="10" fill="white">
                  <animate
                    attributeName="r"
                    values="10;15;10"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>

              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Join Waiting List
                </h1>
                <p className="text-purple-100">
                  Get notified when appointments become available
                </p>
              </div>
            </div>

            {/* Form Section */}
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

              {!showForm ? (
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Select Doctor
                  </label>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by doctor name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => handleDoctorSelect(doctor)}
                        className="border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {doctor.user_full_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {doctor.specialty}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doctor.experience_years} years experience
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredDoctors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No doctors found
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Selected Doctor Info */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {selectedDoctor?.user_full_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedDoctor?.specialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="requested_date"
                        value={formData.requested_date}
                        onChange={handleChange}
                        min={minDate}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Requested Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="time"
                        name="requested_time"
                        value={formData.requested_time}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any specific requirements or information..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 You will be notified via Telegram when an appointment
                      slot becomes available matching your preferences.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Join Waiting List
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedDoctor(null);
                        setFormData({
                          requested_date: "",
                          requested_time: "",
                          notes: "",
                        });
                        setError("");
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* My Waiting List Section */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                My Waiting List
              </h2>
              <p className="text-blue-100">Track your waiting list status</p>
            </div>

            {/* List Section */}
            <div className="p-8">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                </div>
              ) : waitingList.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    No waiting list entries
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Join a waiting list to get notified about available slots
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {waitingList.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Dr. {item.doctor_name}
                            </h3>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                item.is_notified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.is_notified ? "Notified" : "Waiting"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from waiting list"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 ml-13">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span>
                            {new Date(item.requested_date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-green-600" />
                          <span>{item.requested_time}</span>
                        </div>

                        {item.notes && (
                          <p className="text-gray-500 italic mt-2">
                            Note: {item.notes}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          Added:{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
