import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingForm.css";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_URL } from "../../Config";

const formSchema = z.object({
  service: z.string().min(1, "Service select karna lazmi hai"),
  mobile: z
    .string()
    .regex(/^03[0-9]{9}$/, "Valid mobile number likhein (03XXXXXXXXX)"),
  location: z.string().min(5, "Address kam az kam 5 characters ka ho"),
  timing: z.string().min(1, "Timing select karein"),
});

function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const timingTypePreviousPage = location.state?.timing || "urgent";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timing: timingTypePreviousPage,
      service: "",
      location: "",
      mobile: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Booking Data:", data);
    try {
      const res = await axios.post(`${API_URL}/api/booking/new-request`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        alert(
          "Booking successful! When service is completed, go to My Bookings in the menu to leave a review.",
        );
        reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert(error.response?.data?.message || "Booking fail ho gayi!");
    }
    reset();
  };

  return (
    <div className="form-container">
      {/* Back Button */}
      <button type="button" className="exit-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Book Emergency Service</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Service */}
        <label>Service Type</label>
        <select {...register("service")}>
          <option value="" disabled>
            Select Service
          </option>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
          <option value="painter">Painter</option>
          <option value="carpenter">Carpenter</option>
        </select>
        {errors.service && (
          <p className="error-msg">{errors.service.message}</p>
        )}

        {/* Mobile */}
        <label>Mobile Number</label>
        <input type="tel" placeholder="03XXXXXXXXX" {...register("mobile")} />

        {errors.mobile && <p className="error-msg">{errors.mobile.message}</p>}

        {/* Location */}
        <label>Location</label>
        <input
          type="text"
          placeholder="Enter your address"
          {...register("location")}
        />
        {errors.location && (
          <p className="error-msg">{errors.location.message}</p>
        )}

        {/* Timing */}
        <label>Timing Type</label>
        <select {...register("timing")}>
          <option value="urgent">Urgent</option>
          <option value="thirty-min">Within 30 Mins</option>
          <option value="two-days">2–3 Days Later</option>
        </select>

        <button type="submit" className="submit-btn">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
