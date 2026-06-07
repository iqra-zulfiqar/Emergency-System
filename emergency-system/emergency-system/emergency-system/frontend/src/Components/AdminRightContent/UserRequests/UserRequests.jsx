import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserRequests.css";
import { API_URL } from "../../../Config";

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/booking/pending`);
        const allBookings = res.data;
        const pendingBookings = allBookings.filter(
          (booking) => 
            (booking.status || "pending") === "pending" || 
            booking.status === "verified"
        );
        setRequests(pendingBookings);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      console.log(`Updating booking ${id} to status ${status}`);
      const response = await axios.patch(`${API_URL}/api/booking/${id}/status`, { status });
      console.log("Update response:", response.data);
      setRequests(requests.filter((booking) => booking._id !== id));
      alert(`Booking ${status} successfully!`);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed!");
    }
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <h2>📋 Pending User Requests</h2>
        <p>Review and manage pending booking requests.</p>
        {requests.length > 0 && (
          <span className="request-count">Total Pending: {requests.length}</span>
        )}
      </div>

      <div className="cards-grid">
        {loading ? (
          <p className="no-data">Loading requests...</p>
        ) : requests.length > 0 ? (
          requests.map((booking) => (
            <div className="user-card pending-card" key={booking._id}>
              <div className="status-badge">Pending</div>
              <div className="user-details">
                <h3>{booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}</h3>
                <p className="phone-text">📱 Mobile: {booking.mobile}</p>
                <p className="location-text">📍 Address: {booking.location}</p>
                <p className="timing-text">⏱️ Timing: {booking.timing}</p>
              </div>
              <div className="actions">
                <button 
                  className="approve-btn" 
                  onClick={() => handleStatusUpdate(booking._id, "accepted")}
                  title="Accept this booking request"
                >
                  ✓ Accept
                </button>
                <button 
                  className="reject-btn" 
                  onClick={() => handleStatusUpdate(booking._id, "rejected")}
                  title="Reject this booking request"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">✓ No pending requests found. All booking requests have been reviewed!</p>
        )}
      </div>
    </div>
  );
};

export { UserRequests };