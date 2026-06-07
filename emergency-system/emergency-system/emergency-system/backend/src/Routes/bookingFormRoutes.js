import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  getActiveTrackingBooking,
  cancelMyBooking,
  getPendingBookings,
} from "../Controllers/bookingFormControllers.js";
import { protectUser } from "../Middleware/authMiddleware.js";

const bookingFormRoutes = express.Router();

bookingFormRoutes.post("/new-request", createBooking);
bookingFormRoutes.get("/all-booking", getAllBookings);
bookingFormRoutes.get("/pending", getPendingBookings);
bookingFormRoutes.get("/my-bookings", protectUser, getMyBookings);
bookingFormRoutes.get(
  "/active-tracking",
  protectUser,
  getActiveTrackingBooking,
);
bookingFormRoutes.patch(
  "/cancel/:id",
  protectUser,
  cancelMyBooking,
);
bookingFormRoutes.patch("/update-status/:id", updateBookingStatus);
bookingFormRoutes.patch("/:id/status", updateBookingStatus);

export { bookingFormRoutes };
