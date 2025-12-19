// src/config/config.js
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/",
  environment: import.meta.env.MODE || "development",
};

export default config;
