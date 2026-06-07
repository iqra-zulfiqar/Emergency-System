import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Booking } from "../Models/bookingForm.js";
import { Review } from "../Models/review.js";
import {
  handleBookingStatusChange,
  TRACKING_ACTIVE_STATUS,
} from "../socket/trackingSocket.js";

const getUserIdFromToken = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "user") return decoded.id;
    return null;
  } catch {
    return null;
  }
};

const createBooking = async (req, res) => {
  try {
    const { service, mobile, location, timing } = req.body;

    if (!service || !mobile || !location || !timing) {
      return res.status(400).json({
        success: false,
        message: "Tamam fields fill karein!",
      });
    }

    const tokenUserId = getUserIdFromToken(req);
    const newBooking = await Booking.create({
      service,
      mobile,
      location,
      timing,
      userId: tokenUserId ? String(tokenUserId) : null,
    });

    res.status(201).json({
      success: true,
      message: "Emergency request sent successfully!",
      booking: {
        id: newBooking._id,
        service: newBooking.service,
        mobile: newBooking.mobile,
        location: newBooking.location,
        timing: newBooking.timing,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log("new booking error: ", error);
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .select("-__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate("providerId", "name email phone");

    const bookingIds = bookings.map((b) => b._id);
    const userReviews = await Review.find({
      userId,
      bookingId: { $in: bookingIds },
    }).select("bookingId");

    const reviewedBookingIds = new Set(
      userReviews.map((r) => r.bookingId.toString()),
    );

    const bookingsWithReviewFlag = bookings.map((booking) => ({
      ...booking.toObject(),
      hasReview: reviewedBookingIds.has(booking._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: bookingsWithReviewFlag.length,
      bookings: bookingsWithReviewFlag,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, providerId } = req.body;

    const allowedStatus = [
      "pending",
      "verified",
      "accepted",
      "rejected",
      "cancelled",
      "completed",
    ];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking nahi mili!",
      });
    }

    const currentStatus = booking.status || "pending";
    const canComplete =
      currentStatus === "pending" ||
      currentStatus === "verified" ||
      currentStatus === TRACKING_ACTIVE_STATUS;

    if (status === "completed" && !canComplete) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be marked as completed.",
      });
    }

    if (status === TRACKING_ACTIVE_STATUS && currentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be accepted.",
      });
    }

    if (status === "rejected" && !["pending", TRACKING_ACTIVE_STATUS].includes(currentStatus)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be rejected.",
      });
    }

    const updateData = { status };

    if (status === TRACKING_ACTIVE_STATUS) {
      if (!providerId) {
        return res.status(400).json({
          success: false,
          message:
            "Service provider must be logged in to accept a booking for live tracking.",
        });
      }
      updateData.providerId = providerId;
    }

    if (status === "completed" && providerId) {
      updateData.providerId = providerId;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).populate("providerId", "name email phone");

    handleBookingStatusChange(updatedBooking);

    res.status(200).json({
      success: true,
      message: `Booking status ab ${status} hai.`,
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getActiveTrackingBooking = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required for live tracking.",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const booking = await Booking.findOne({
      userId: userObjectId,
      status: TRACKING_ACTIVE_STATUS,
      providerId: { $ne: null },
    })
      .sort({ updatedAt: -1 })
      .populate("providerId", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "No active booking available for live tracking. Your request must be accepted by a service provider, and you must be logged in when you create the booking.",
      });
    }

    res.status(200).json({
      success: true,
      booking,
      trackingUserId: String(userId),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelMyBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id, userId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const currentStatus = booking.status || "pending";
    if (!["pending", TRACKING_ACTIVE_STATUS].includes(currentStatus)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    handleBookingStatusChange(booking);

    res.status(200).json({
      success: true,
      message: "Booking cancelled.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createBooking,
  getAllBookings,
  getPendingBookings,
  getMyBookings,
  updateBookingStatus,
  getActiveTrackingBooking,
  cancelMyBooking,
};
