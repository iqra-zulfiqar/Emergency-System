import React from "react";
import "./BookingOptions.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

function BookingOptions() {
  const navigate = useNavigate(); // IMPORTANT

  const handleBooking = (type) => {
    console.log("Booking started:", type);

    navigate("/booking-options/booking-form", {
      state: { timing: type },
    });
  };

  return (
    <>
      <div className="booking-container">
        <h2 className="booking-title">Select Booking Type</h2>

        <div className="booking-cards">
          <div
            className="booking-card urgent"
            onClick={() => handleBooking("urgent")}
          >
            <h3>🚨 Urgent Booking</h3>
            <p>Immediate service within minutes for critical emergencies.</p>
            <button className="book-btn">Book Service</button>
          </div>

          <div
            className="booking-card one-hour"
            onClick={() => handleBooking("thirty-min")}
          >
            <h3>⏳ Booking in 30 Mins</h3>
            <p>Schedule service within the next hour.</p>
            <button className="book-btn">Book Service</button>
          </div>

          <div
            className="booking-card later"
            onClick={() => handleBooking("two-days")}
          >
            <h3>📅 Booking After 2–3 Days</h3>
            <p>Plan your service at your convenience.</p>
            <button className="book-btn">Book Service</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingOptions;
