import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ArrowLeft,
  Filter,
  Search,
  Mail,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import axios from "axios";

const NotificationLogs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMessageType, setFilterMessageType] = useState("all");

  useEffect(() => {
    fetchNotificationLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterChannel, filterStatus, filterMessageType, logs]);

  const fetchNotificationLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.get("/api/notifications/logs/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error("Error fetching notification logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.channel?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Channel filter
    if (filterChannel !== "all") {
      filtered = filtered.filter((log) => log.channel === filterChannel);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((log) => log.status === filterStatus);
    }

    // Message type filter
    if (filterMessageType !== "all") {
      filtered = filtered.filter(
        (log) => log.message_type === filterMessageType
      );
    }

    setFilteredLogs(filtered);
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "telegram":
        return <Send className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      sent: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getChannelColor = (channel) => {
    const colors = {
      email: "bg-blue-100 text-blue-800",
      telegram: "bg-cyan-100 text-cyan-800",
    };
    return colors[channel] || "bg-gray-100 text-gray-800";
  };

  const getMessageTypeColor = (type) => {
    const colors = {
      appointment_confirmation: "bg-green-100 text-green-800",
      appointment_reminder: "bg-blue-100 text-blue-800",
      appointment_cancellation: "bg-red-100 text-red-800",
      waiting_list_notification: "bg-purple-100 text-purple-800",
      schedule_change: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const messageTypes = [
    "appointment_confirmation",
    "appointment_reminder",
    "appointment_cancellation",
    "waiting_list_notification",
    "schedule_change",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

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

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 relative overflow-hidden">
            <svg
              className="absolute right-0 top-0 w-64 h-64 opacity-10"
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" r="60" fill="white">
                <animate
                  attributeName="r"
                  values="60;70;60"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <path d="M100 80 L120 100 L100 120 L80 100 Z" fill="white">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 100"
                  to="360 100 100"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>

            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Notification Logs
                  </h1>
                  <p className="text-blue-100">
                    Track all your notifications and delivery status
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="p-8 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Channel Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Channels</option>
                  <option value="email">Email</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>

              {/* Message Type Filter */}
              <select
                value={filterMessageType}
                onChange={(e) => setFilterMessageType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                {messageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  {logs.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700">Sent</p>
                <p className="text-2xl font-bold text-green-800">
                  {logs.filter((l) => l.status === "sent").length}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-700">Failed</p>
                <p className="text-2xl font-bold text-red-800">
                  {logs.filter((l) => l.status === "failed").length}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-yellow-700">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {logs.filter((l) => l.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="p-8">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No notifications found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getStatusIcon(log.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getMessageTypeColor(
                                  log.message_type
                                )}`}
                              >
                                {log.message_type
                                  ?.replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getChannelColor(
                                  log.channel
                                )}`}
                              >
                                {getChannelIcon(log.channel)}
                                <span className="ml-1">
                                  {log.channel?.toUpperCase()}
                                </span>
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  log.status
                                )}`}
                              >
                                {log.status?.toUpperCase()}
                              </span>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>
                                  {new Date(log.sent_at).toLocaleString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>

                              {log.user_full_name && (
                                <div className="flex items-center gap-2">
                                  <Bell className="w-4 h-4 text-purple-600" />
                                  <span>Sent to: {log.user_full_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {log.error_message && (
                          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-start">
                              <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-red-800">
                                  Error Details:
                                </p>
                                <p className="text-sm text-red-700 mt-1">
                                  {log.error_message}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination info (if needed) */}
            {filteredLogs.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Showing {filteredLogs.length} of {logs.length} notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationLogs;
