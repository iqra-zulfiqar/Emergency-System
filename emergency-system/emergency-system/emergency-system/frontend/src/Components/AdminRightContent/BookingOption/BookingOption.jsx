import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingOption.css";
import { API_URL } from "../../../Config";
import { ProviderGpsTracker } from "../../ProviderGpsTracker/ProviderGpsTracker";

const getStatus = (booking) => booking.status || "pending";

const BookingOption = () => {
  const [bookingData, setBookingData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [fetchError, setFetchError] = useState("");
  const adminId = localStorage.getItem("adminId");

  const fetchBookings = async () => {
    try {
      setFetchError("");
      const res = await axios.get(`${API_URL}/api/booking/all-booking`);
      if (res.data.success) {
        setBookingData(res.data.bookings);
      }
    } catch (error) {
      setFetchError(
        error.response?.data?.message ||
          "Could not load bookings. Check backend is running.",
      );
    }
  };

  const fetchReviews = async () => {
    if (!adminId) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/reviews/provider/${adminId}`,
      );
      if (res.data.success) {
        setReviews(res.data.reviews);
        setAverageRating(res.data.averageRating);
      }
    } catch (error) {
      console.log("Reviews fetch error:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchReviews();
  }, []);

  const markCompleted = async (bookingId) => {
    try {
      const body = { status: "completed" };
      if (adminId) body.providerId = adminId;

      const res = await axios.patch(
        `${API_URL}/api/booking/update-status/${bookingId}`,
        body,
      );

      if (res.data.success) {
        const updated = res.data.booking;
        setBookingData((prev) =>
          prev.map((b) =>
            String(b._id) === String(bookingId)
              ? { ...b, ...updated, status: "completed" }
              : b,
          ),
        );
        setStatusFilter("completed");
        fetchReviews();
        alert("Booking marked COMPLETED. User can now give review on My Bookings.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Could not mark as completed.");
    }
  };

  const acceptBooking = async (bookingId) => {
    if (!adminId) {
      alert("Admin login required to accept bookings.");
      return;
    }
    try {
      const res = await axios.patch(
        `${API_URL}/api/booking/update-status/${bookingId}`,
        { status: "accepted", providerId: adminId },
      );
      if (res.data.success) {
        const updated = res.data.booking;
        setBookingData((prev) =>
          prev.map((b) =>
            String(b._id) === String(bookingId) ? { ...b, ...updated } : b,
          ),
        );
        setStatusFilter("accepted");
        alert(
          "Booking accepted. Live GPS tracking started — keep this page open while traveling.",
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Could not accept booking.");
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/booking/update-status/${bookingId}`,
        { status: "rejected" },
      );
      if (res.data.success) {
        setBookingData((prev) =>
          prev.map((b) =>
            String(b._id) === String(bookingId)
              ? { ...b, status: "rejected" }
              : b,
          ),
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Could not reject booking.");
    }
  };

  const myAcceptedBookings = bookingData.filter((b) => {
    const providerRef = b.providerId?._id || b.providerId;
    return (
      getStatus(b) === "accepted" &&
      adminId &&
      String(providerRef) === String(adminId)
    );
  });

  const visibleBookings = bookingData.filter((b) => {
    if (statusFilter === "all") return true;
    return getStatus(b) === statusFilter;
  });

  return (
    <div className="booking-option">
      <div className="page-header">
        <h2>Booking Requests</h2>
        <p className="simple-admin-hint">
          To test reviews: click the black <strong>Mark Completed</strong> button
          on a booking card. The <strong>Completed</strong> tab below only{" "}
          <em>shows</em> completed bookings, it does not complete them.
        </p>
      </div>

      {fetchError && <p className="booking-fetch-error">{fetchError}</p>}

      <ProviderGpsTracker bookings={myAcceptedBookings} providerId={adminId} />

      <div className="pending-varified">
        <button
          type="button"
          className={statusFilter === "all" ? "active-status" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={statusFilter === "pending" ? "active-status" : ""}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>
        <button
          type="button"
          className={statusFilter === "accepted" ? "active-status" : ""}
          onClick={() => setStatusFilter("accepted")}
        >
          Accepted (Live)
        </button>
        <button
          type="button"
          className={statusFilter === "completed" ? "active-status" : ""}
          onClick={() => setStatusFilter("completed")}
        >
          View Completed
        </button>
      </div>

      <div className="cards-grid">
        {visibleBookings.length > 0 ? (
          visibleBookings.map((booking) => {
            const status = getStatus(booking);
            return (
              <div
                className={`user-card ${status === "completed" ? "approved-border" : "pending-border"}`}
                key={booking._id}
              >
                <div className="user-details">
                  <h3>{booking.service}</h3>
                  <p>
                    <strong>Mobile:</strong> {booking.mobile}
                  </p>
                  <p>
                    <strong>Address:</strong> {booking.location}
                  </p>
                  <span className={`status-tag ${status}`}>{status}</span>

                  <div className="card-footer">
                    {status === "completed" ? (
                      <span className="badge">Completed ✅</span>
                    ) : status === "rejected" || status === "cancelled" ? (
                      <span className="badge">{status}</span>
                    ) : (
                      <div className="card-footer-actions">
                        {status === "pending" && (
                          <>
                            <button
                              type="button"
                              className="verify-action-btn"
                              onClick={() => acceptBooking(booking._id)}
                            >
                              Accept (start live tracking)
                            </button>
                            <button
                              type="button"
                              className="reject-action-btn"
                              onClick={() => rejectBooking(booking._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {status === "accepted" && (
                          <button
                            type="button"
                            className="complete-action-btn"
                            onClick={() => markCompleted(booking._id)}
                          >
                            Mark Completed
                          </button>
                        )}
                        {status !== "pending" && status !== "accepted" && (
                          <button
                            type="button"
                            className="complete-action-btn"
                            onClick={() => markCompleted(booking._id)}
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data">
            {statusFilter === "completed" ? (
              <>
                <p>No completed bookings yet.</p>
                <p>
                  Click <strong>All</strong> or <strong>Pending</strong>, then
                  press <strong>Mark Completed</strong> on a card.
                </p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => setStatusFilter("all")}
                >
                  Show all bookings
                </button>
              </>
            ) : (
              <p>No bookings found. Create one as a logged-in user first.</p>
            )}
          </div>
        )}
      </div>

      <div className="provider-reviews-section">
        <h3>Customer Reviews</h3>
        <p className="reviews-avg">
          Average: {averageRating || 0} ★ ({reviews.length} reviews)
        </p>
        {reviews.length === 0 ? (
          <p className="no-reviews-inline">No reviews yet.</p>
        ) : (
          <div className="reviews-inline-list">
            {reviews.map((review) => (
              <div className="review-inline-card" key={review._id}>
                <strong>{review.userId?.name || "User"}</strong>
                <span>{"★".repeat(review.rating)}</span>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { BookingOption };