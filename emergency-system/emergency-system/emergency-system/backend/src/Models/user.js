import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Naya user hamesha pending hoga
    },
    role : {
      type : String,
      default : 'user'
    },
    cv: {
      type: String, // Yahan file ka path ya Cloudinary URL save hoga
      required: false,
    },
  },
  {
    timestamps: true, // Isse createdAt aur updatedAt khud ba khud ban jayenge
  },
);

const User = mongoose.model("User", userSchema);
export { User };
