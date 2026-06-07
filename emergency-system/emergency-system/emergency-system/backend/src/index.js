import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import { userRoutes } from "./Routes/userRoutes.js";
import { UserRequestRoutes } from "./Routes/userRequestRoutes.js";
import { adminRoutes } from "./Routes/adminRoutes.js";
import { bookingFormRoutes } from "./Routes/bookingFormRoutes.js";
import { reviewRoutes } from "./Routes/reviewRoutes.js";
import { setupTrackingSocket } from "./socket/trackingSocket.js";

// 👇 ADD THIS (IMPORTANT)
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

setupTrackingSocket(io);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

app.get("/api/status", (req, res) => {
  res.send({ status: "Online", version: "1.0.0-esm" });
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user-req", UserRequestRoutes);
app.use("/api/booking", bookingFormRoutes);
app.use("/api/reviews", reviewRoutes);

// Connect DB BEFORE starting server
connectDB();

server.listen(PORT, () => {
  console.log(`Server is running in ESM mode on port ${PORT}`);
});