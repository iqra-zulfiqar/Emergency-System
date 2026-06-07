import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name zaroori hai"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: [6, "Password kam az kam 6 characters ka hona chahiye"],
    },
    phone: {
      type: String,
      required: [true, "Phone number zaroori hai"],
    },
    address: {
      type: String,
      required: [true, "Address zaroori hai"],
    },
    cv: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "admin", // Taake login ke waqt hum role check kar sakein
    }
  },
  {
    timestamps: true, // Isse createdAt aur updatedAt ban jayenge
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export { Admin };