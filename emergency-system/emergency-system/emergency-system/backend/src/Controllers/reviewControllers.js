import { Review } from "../Models/review.js";
import { Booking } from "../Models/bookingForm.js";

const addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "bookingId, rating, and comment are required!",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5!",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found!",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Reviews are only allowed for completed bookings!",
      });
    }

    if (!booking.userId || booking.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own bookings!",
      });
    }

    if (!booking.providerId) {
      return res.status(400).json({
        success: false,
        message: "No service provider assigned to this booking!",
      });
    }

    const existingReview = await Review.findOne({ bookingId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this booking!",
      });
    }

    const newReview = await Review.create({
      userId,
      providerId: booking.providerId,
      bookingId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: newReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this booking!",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await Review.find({ providerId })
      .populate("userId", "name email")
      .populate("bookingId", "service location timing")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addReview, getProviderReviews };
