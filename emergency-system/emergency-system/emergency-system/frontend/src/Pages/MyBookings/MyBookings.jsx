import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config";
import { AuthContext } from "../../Context/AuthContext";
import { ReviewModal } from "../../Components/ReviewModal/ReviewModal";
import "./MyBookings.css";

const MyBookings = () => {
  const { userIsLogedIn, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const isUser = role === "user" || userIsLogedIn;
    if (!isUser || role === "admin") {
      navigate("/login");
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/booking/my-bookings`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [userIsLogedIn, role, navigate]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await axios.patch(
        `${API_URL}/api/booking/cancel/${bookingId}`,
        {},
        { withCredentials: true },
      );
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "cancelled" } : b,
          ),
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Could not cancel booking.");
    }
  };

  const handleReviewSubmitted = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, hasReview: true } : b,
      ),
    );
  };

  if (loading) {
    return <div className="my-bookings-page"><p>Loading your bookings...</p></div>;
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-header">
        <h2>My Bookings</h2>
        <p>
          After admin marks your service as completed, use <strong>Give Review</strong> here.
          (Reviews are submitted on this page, not on the admin dashboard.)
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="my-bookings-empty">
          <p>No bookings found linked to your account.</p>
          <p className="my-bookings-hint">
            You must be logged in when booking. After admin verifies and marks
            completed, the Give Review button will appear here.
          </p>
          <button type="button" onClick={() => navigate("/booking-options")}>
            Book Now
          </button>
        </div>
      ) : (
        <>
        {!bookings.some((b) => (b.status || "pending") === "completed") && (
          <p className="my-bookings-waiting">
            No completed services yet. Give Review will show after admin marks
            your booking as completed.
          </p>
        )}
        <div className="my-bookings-grid">
          {bookings.map((booking) => (
            <div className={`my-booking-card status-${booking.status}`} key={booking._id}>
              <h3>{booking.service}</h3>
              <p><strong>Mobile:</strong> {booking.mobile}</p>
              <p><strong>Location:</strong> {booking.location}</p>
              <p><strong>Timing:</strong> {booking.timing.replace("-", " ")}</p>
              {booking.providerId?.name && (
                <p><strong>Provider:</strong> {booking.providerId.name}</p>
              )}
              <span className={`booking-status-badge ${booking.status}`}>
                {booking.status}
              </span>

              <div className="my-booking-actions">
                {(booking.status || "pending") === "accepted" && (
                  <Link className="live-track-link" to="/live-tracking">
                    Live Tracking
                  </Link>
                )}
                {["pending", "accepted"].includes(booking.status || "pending") && (
                  <button
                    type="button"
                    className="cancel-booking-btn"
                    onClick={() => cancelBooking(booking._id)}
                  >
                    Cancel
                  </button>
                )}
                {(booking.status || "pending") === "completed" && !booking.hasReview && (
                  <button
                    type="button"
                    className="give-review-btn"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    Give Review
                  </button>
                )}
                {(booking.status || "pending") === "completed" && booking.hasReview && (
                  <span className="reviewed-badge">Review Submitted ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default MyBookings;
