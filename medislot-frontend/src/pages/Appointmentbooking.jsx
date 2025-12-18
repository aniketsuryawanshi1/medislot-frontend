import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Search,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    appointment_date: "",
    start_time: "",
    end_time: "",
    service_type: "",
    notes: "",
  });

  const serviceTypes = [
    "Consultation",
    "Follow-up",
    "Check-up",
    "Urgent Care",
    "Preventive Care",
    "Diagnostic",
    "Treatment",
    "Other",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && formData.appointment_date) {
      fetchDoctorSchedule();
    }
  }, [selectedDoctor, formData.appointment_date]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.get("/api/doctors/list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);
    } catch (error) {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorSchedule = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const dayOfWeek = new Date(formData.appointment_date).toLocaleDateString(
        "en-US",
        { weekday: "long" }
      );

      const response = await axios.get(
        `/api/doctors/${selectedDoctor.id}/schedules/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { day_of_week: dayOfWeek },
        }
      );

      setSchedules(response.data);
      if (response.data.length > 0) {
        generateTimeSlots(response.data[0]);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      setAvailableSlots([]);
    }
  };

  const generateTimeSlots = (schedule) => {
    const slots = [];
    const startTime = schedule.start_time;
    const endTime = schedule.end_time;
    const breakStart = schedule.break_start;
    const breakEnd = schedule.break_end;

    let current = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    while (current < end) {
      const slotStart = current.toTimeString().slice(0, 5);
      current.setMinutes(current.getMinutes() + 30);
      const slotEnd = current.toTimeString().slice(0, 5);

      // Skip break time
      if (breakStart && breakEnd) {
        const isBreak = slotStart >= breakStart && slotStart < breakEnd;
        if (!isBreak && current <= end) {
          slots.push({ start: slotStart, end: slotEnd });
        }
      } else {
        if (current <= end) {
          slots.push({ start: slotStart, end: slotEnd });
        }
      }
    }

    setAvailableSlots(slots);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData((prev) => ({
      ...prev,
      start_time: "",
      end_time: "",
    }));
    setAvailableSlots([]);
  };

  const handleTimeSlotSelect = (slot) => {
    setFormData((prev) => ({
      ...prev,
      start_time: slot.start,
      end_time: slot.end,
    }));
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

    if (
      !formData.appointment_date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setError("Please select date and time slot");
      return;
    }

    if (!formData.service_type) {
      setError("Please select service type");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("access_token");

      const bookingData = {
        doctor: selectedDoctor.id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        service_type: formData.service_type,
        status: "pending",
        notes: formData.notes,
      };

      await axios.post("/api/patients/appointments/book/", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const minDate = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Appointment Booked!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment with Dr. {selectedDoctor?.user_full_name} has been
            successfully booked.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(formData.appointment_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center justify-center text-sm text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              {formData.start_time} - {formData.end_time}
            </div>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 relative overflow-hidden">
            <svg
              className="absolute right-0 top-0 w-64 h-64 opacity-10"
              viewBox="0 0 200 200"
            >
              <rect x="40" y="40" width="120" height="120" fill="white" rx="10">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>
              <circle cx="100" cy="70" r="15" fill="white" />
              <line
                x1="70"
                y1="100"
                x2="130"
                y2="100"
                stroke="white"
                strokeWidth="3"
              />
              <line
                x1="70"
                y1="120"
                x2="130"
                y2="120"
                stroke="white"
                strokeWidth="3"
              />
              <line
                x1="70"
                y1="140"
                x2="110"
                y2="140"
                stroke="white"
                strokeWidth="3"
              />
            </svg>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2">
                Book Appointment
              </h1>
              <p className="text-blue-100">
                Schedule your visit with our doctors
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Doctor Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Step 1: Select Doctor <span className="text-red-500">*</span>
                </label>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by doctor name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 ${
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-600 bg-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {doctor.user_full_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {doctor.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>📋 License: {doctor.license_number}</p>
                        <p>💼 {doctor.experience_years} years experience</p>
                        {doctor.contact_phone && (
                          <p>📞 {doctor.contact_phone}</p>
                        )}
                      </div>
                      {doctor.bio && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {filteredDoctors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No doctors found matching your search
                  </div>
                )}
              </div>

              {selectedDoctor && (
                <>
                  {/* Date Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Step 2: Select Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-md">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="appointment_date"
                        value={formData.appointment_date}
                        onChange={handleChange}
                        min={minDate}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {formData.appointment_date && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Step 3: Select Time Slot{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleTimeSlotSelect(slot)}
                              className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                                formData.start_time === slot.start
                                  ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {slot.start}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                          <p className="text-yellow-800 font-medium">
                            No available slots for this date
                          </p>
                          <p className="text-yellow-600 text-sm mt-2">
                            Please select a different date or join the waiting
                            list
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Service Type */}
                  {formData.start_time && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Step 4: Service Type{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        required
                        className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Service Type</option>
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Notes */}
                  {formData.service_type && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Step 5: Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Any specific concerns or information for the doctor..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              {selectedDoctor && formData.service_type && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Book Appointment
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
