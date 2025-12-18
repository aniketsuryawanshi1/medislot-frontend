import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Save,
  ArrowLeft,
  Calendar,
  Phone,
  FileText,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const PatientProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [formData, setFormData] = useState({
    date_of_birth: "",
    gender: "",
    emergency_contact: "",
    emergency_phone: "",
    medical_history: "",
  });

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.get("/api/patients/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setProfileExists(true);
        setFormData({
          date_of_birth: response.data.date_of_birth || "",
          gender: response.data.gender || "",
          emergency_contact: response.data.emergency_contact || "",
          emergency_phone: response.data.emergency_phone || "",
          medical_history: response.data.medical_history || "",
        });
        setUserInfo({
          username: response.data.user_full_name || "",
          email: response.data.email || "",
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setProfileExists(false);
        setIsEditing(true);
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
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
    if (!formData.date_of_birth || !formData.gender) {
      setError("Date of birth and gender are required");
      return;
    }

    if (!formData.emergency_contact || !formData.emergency_phone) {
      setError("Emergency contact information is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("access_token");

      const endpoint = profileExists
        ? "/api/patients/profile/update/"
        : "/api/patients/profile/create/";
      const method = profileExists ? "put" : "post";

      await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Profile saved successfully!");
      setIsEditing(false);
      setProfileExists(true);

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      await fetchProfile();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 relative overflow-hidden">
            <svg
              className="absolute right-0 top-0 w-64 h-64 opacity-10"
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" r="80" fill="white">
                <animate
                  attributeName="r"
                  values="80;90;80"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="100" cy="60" r="25" fill="white" />
              <path
                d="M60 120 Q100 100 140 120 L140 180 L60 180 Z"
                fill="white"
              />
            </svg>

            <div className="relative z-10 flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">Patient Profile</h1>
                <p className="text-blue-100">
                  {userInfo.username || "Complete your profile"}
                </p>
              </div>
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
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {!isEditing && profileExists ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-3">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Date of Birth
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {new Date(formData.date_of_birth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-green-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Gender
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg capitalize">
                      {formData.gender}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-purple-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Emergency Contact
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {formData.emergency_contact}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center mb-3">
                      <Phone className="w-5 h-5 text-orange-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Emergency Phone
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {formData.emergency_phone}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                    <label className="text-sm font-semibold text-gray-700">
                      Medical History
                    </label>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {formData.medical_history || "No medical history provided"}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Emergency Contact Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="emergency_contact"
                        value={formData.emergency_contact}
                        onChange={handleChange}
                        placeholder="Emergency contact name"
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Emergency Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="emergency_phone"
                        value={formData.emergency_phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical History
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="medical_history"
                      value={formData.medical_history}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Allergies, chronic conditions, current medications, past surgeries, etc."
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This information helps doctors provide better care
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Profile
                      </>
                    )}
                  </button>

                  {profileExists && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setError("");
                        fetchProfile();
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
