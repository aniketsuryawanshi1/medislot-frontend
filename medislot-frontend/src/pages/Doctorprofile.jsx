import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Save,
  ArrowLeft,
  Award,
  Briefcase,
  Phone,
  FileText,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [formData, setFormData] = useState({
    specialty: "",
    license_number: "",
    experience_years: "",
    contact_phone: "",
    bio: "",
  });

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const specialties = [
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "Psychiatry",
    "Oncology",
    "Gynecology",
    "Ophthalmology",
    "ENT (Ear, Nose, Throat)",
    "Gastroenterology",
    "Endocrinology",
    "Pulmonology",
    "Nephrology",
    "Rheumatology",
    "Urology",
    "Radiology",
    "Anesthesiology",
    "Emergency Medicine",
    "Other",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.get("/api/doctors/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setProfileExists(true);
        setFormData({
          specialty: response.data.specialty || "",
          license_number: response.data.license_number || "",
          experience_years: response.data.experience_years || "",
          contact_phone: response.data.contact_phone || "",
          bio: response.data.bio || "",
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
    if (
      !formData.specialty ||
      !formData.license_number ||
      !formData.experience_years
    ) {
      setError("Specialty, license number, and experience years are required");
      return;
    }

    if (formData.experience_years < 0 || formData.experience_years > 100) {
      setError("Experience years must be between 0 and 100");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("access_token");

      const endpoint = profileExists
        ? "/api/doctors/profile/update/"
        : "/api/doctors/profile/create/";
      const method = profileExists ? "put" : "post";

      const profileData = {
        specialty: formData.specialty,
        license_number: formData.license_number,
        experience_years: parseInt(formData.experience_years),
        contact_phone: formData.contact_phone,
        bio: formData.bio,
      };

      await axios[method](endpoint, profileData, {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 relative overflow-hidden">
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
              <rect
                x="85"
                y="50"
                width="30"
                height="15"
                fill="none"
                stroke="purple"
                strokeWidth="2"
              />
            </svg>

            <div className="relative z-10 flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <User className="w-12 h-12 text-purple-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">Doctor Profile</h1>
                <p className="text-purple-100">
                  {userInfo.username || "Complete your professional profile"}
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
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center mb-3">
                      <Award className="w-5 h-5 text-purple-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Specialty
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {formData.specialty}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FileText className="w-5 h-5 text-blue-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        License Number
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg font-mono">
                      {formData.license_number}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center mb-3">
                      <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Experience
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {formData.experience_years} years
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center mb-3">
                      <Phone className="w-5 h-5 text-orange-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Contact Phone
                      </label>
                    </div>
                    <p className="text-gray-800 text-lg">
                      {formData.contact_phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                    <label className="text-sm font-semibold text-gray-700">
                      Professional Bio
                    </label>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {formData.bio || "No bio provided"}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
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
                      Specialty <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all"
                      >
                        <option value="">Select Specialty</option>
                        {specialties.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        placeholder="e.g., MD123456"
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={handleChange}
                        placeholder="e.g., 10"
                        min="0"
                        max="100"
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Tell patients about your education, specializations, approach to patient care, and any other relevant information..."
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This will be visible to patients when they search for
                    doctors
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

export default DoctorProfile;
