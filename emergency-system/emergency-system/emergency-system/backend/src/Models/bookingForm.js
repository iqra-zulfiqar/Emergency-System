import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    service: {
      type: String,
      required: [true, "Service type is required"],
      enum: ["electrician", "plumber", "painter", "carpenter"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^03[0-9]{9}$/, "Please provide a valid Pakistani mobile number"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [5, "Location address must be at least 5 characters long"],
    },
    timing: {
      type: String,
      required: [true, "Timing is required"],
      enum: ["urgent", "thirty-min", "two-days"],
      default: "urgent",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "verified",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
