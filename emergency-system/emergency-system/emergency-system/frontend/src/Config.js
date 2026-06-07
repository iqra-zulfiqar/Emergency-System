// src/config.js
export const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

/** Local testing: skip verify step and complete pending bookings directly */
export const REVIEW_TEST_MODE =
  import.meta.env.VITE_REVIEW_TEST_MODE === "true" ||
  (import.meta.env.DEV && import.meta.env.VITE_REVIEW_TEST_MODE !== "false");