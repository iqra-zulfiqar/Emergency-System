import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config";
import "./ReviewModal.css";

const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      setError("Please write a comment (at least 3 characters).");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/reviews/add`,
        {
          bookingId: booking._id,
          rating,
          comment: comment.trim(),
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        onReviewSubmitted(booking._id);
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit review. Try again!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="review-modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Rate Service Provider</h3>
        <p className="review-modal-subtitle">
          {booking.service} — {booking.location}
        </p>

        {error && <p className="review-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Your Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${
                  star <= (hoverRating || rating) ? "active" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>

          <label>Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this service..."
            rows={4}
          />

          <button type="submit" className="review-submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { ReviewModal };
