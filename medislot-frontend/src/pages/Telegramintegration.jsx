import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Link as LinkIcon,
  Unlink,
  Copy,
  Check,
} from "lucide-react";
import axios from "axios";

const TelegramIntegration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    chat_id: "",
    username: "",
  });

  const botUsername = "@MediSlotBot"; // Replace with your actual bot username
  const botLink = `https://t.me/MediSlotBot`; // Replace with your actual bot link

  useEffect(() => {
    fetchTelegramUser();
  }, []);

  const fetchTelegramUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.get("/api/telegram/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setTelegramUser(response.data);
        setFormData({
          chat_id: response.data.chat_id || "",
          username: response.data.username || "",
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching Telegram user:", error);
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

  const handleLink = async (e) => {
    e.preventDefault();

    if (!formData.chat_id || !formData.username) {
      setError("Both Chat ID and Username are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("access_token");

      const linkData = {
        chat_id: formData.chat_id,
        username: formData.username,
        is_active: true,
      };

      await axios.post("/api/telegram/link/", linkData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Telegram account linked successfully!");
      setTimeout(() => setSuccess(""), 3000);
      await fetchTelegramUser();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to link Telegram account"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUnlink = async () => {
    if (
      !window.confirm(
        "Are you sure you want to unlink your Telegram account? You will stop receiving notifications."
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("access_token");

      await axios.delete("/api/telegram/unlink/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Telegram account unlinked successfully");
      setTelegramUser(null);
      setFormData({ chat_id: "", username: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to unlink Telegram account");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 relative overflow-hidden">
            <svg
              className="absolute right-0 top-0 w-64 h-64 opacity-10"
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" r="60" fill="white">
                <animate
                  attributeName="r"
                  values="60;65;60"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <path
                d="M85 90 L95 100 L115 80"
                stroke="#0088cc"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              >
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M60 100 Q100 70 140 100 Q100 130 60 100"
                fill="#0088cc"
                opacity="0.3"
              >
                <animate
                  attributeName="d"
                  values="M60 100 Q100 70 140 100 Q100 130 60 100;M60 100 Q100 75 140 100 Q100 125 60 100;M60 100 Q100 70 140 100 Q100 130 60 100"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>

            <div className="relative z-10 flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Send className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">
                  Telegram Integration
                </h1>
                <p className="text-blue-100">
                  Get instant notifications about your appointments
                </p>
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

            {telegramUser && telegramUser.is_active ? (
              /* Linked State */
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Telegram Linked
                      </h3>
                      <p className="text-sm text-gray-600">
                        Your account is connected and active
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Username
                      </label>
                      <p className="text-gray-800">@{telegramUser.username}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Chat ID
                      </label>
                      <p className="text-gray-800 font-mono">
                        {telegramUser.chat_id}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Status
                      </label>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    </div>

                    {telegramUser.created_at && (
                      <div className="bg-white rounded-lg p-4">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Linked Since
                        </label>
                        <p className="text-gray-800">
                          {new Date(telegramUser.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📱 What you'll receive:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Appointment confirmations and reminders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Waiting list updates and available slot notifications
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Schedule changes and cancellations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Important announcements from your doctors</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleUnlink}
                  disabled={saving}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <Unlink className="w-5 h-5 mr-2" />
                      Unlink Telegram Account
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Not Linked State */
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    How to Link Your Telegram
                  </h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-bold text-blue-600 mr-3 text-lg">
                        1.
                      </span>
                      <div>
                        <span>Open Telegram and search for our bot:</span>
                        <div className="mt-2 bg-white rounded-lg p-3 flex items-center justify-between">
                          <code className="text-blue-600 font-semibold">
                            {botUsername}
                          </code>
                          <button
                            onClick={() => copyToClipboard(botUsername)}
                            className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy bot username"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <a
                          href={botLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-blue-600 hover:text-blue-700 text-sm underline"
                        >
                          Or click here to open the bot →
                        </a>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <span className="font-bold text-blue-600 mr-3 text-lg">
                        2.
                      </span>
                      <div>
                        <span>
                          Start a conversation with the bot by sending
                        </span>
                        <code className="ml-1 bg-white px-2 py-1 rounded text-sm">
                          /start
                        </code>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <span className="font-bold text-blue-600 mr-3 text-lg">
                        3.
                      </span>
                      <span>
                        The bot will send you your Chat ID and Username
                      </span>
                    </li>

                    <li className="flex items-start">
                      <span className="font-bold text-blue-600 mr-3 text-lg">
                        4.
                      </span>
                      <span>Copy and paste them in the form below</span>
                    </li>
                  </ol>
                </div>

                <form onSubmit={handleLink} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Chat ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="chat_id"
                      value={formData.chat_id}
                      onChange={handleChange}
                      placeholder="e.g., 123456789"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This will be provided by the bot when you start a
                      conversation
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telegram Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        @
                      </span>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="your_username"
                        required
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Your Telegram username (without the @)
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Make sure you've started a conversation with the bot
                      before linking your account. Otherwise, you won't receive
                      notifications.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                    ) : (
                      <>
                        <LinkIcon className="w-5 h-5 mr-2" />
                        Link Telegram Account
                      </>
                    )}
                  </button>
                </form>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Benefits of Linking Telegram
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Instant notifications for appointment confirmations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Real-time updates when waiting list slots become
                        available
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Never miss important appointment reminders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Get alerts about schedule changes immediately</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramIntegration;
