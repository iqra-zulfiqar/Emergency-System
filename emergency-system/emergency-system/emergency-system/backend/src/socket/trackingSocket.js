import jwt from "jsonwebtoken";
import { Booking } from "../Models/bookingForm.js";

const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});

const TRACKING_ACTIVE_STATUS = "accepted";
const TRACKING_STOP_STATUSES = ["completed", "rejected", "cancelled"];

/** @type {Map<string, { bookingId: string, providerId: string, userId: string, latitude: number, longitude: number, updatedAt: Date }>} */
const activeTrackingSessions = new Map();

let ioRef = null;

const parseTokenFromHandshake = (socket) => {
  const rawCookie = socket.handshake.headers.cookie;
  if (!rawCookie) return null;
  const parsed = parseCookies(rawCookie);
  const token = parsed?.token;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const isTrackingAllowed = (status) => status === TRACKING_ACTIVE_STATUS;

const getBookingIdString = (bookingId) => String(bookingId);

const toIdString = (value) => {
  if (value == null) return "";
  if (typeof value === "object") {
    if (value._id != null) return String(value._id);
    if (value.id != null) return String(value.id);
  }
  return String(value);
};

const resolveUserActorId = (socket, bookingUserId) => {
  const decoded = parseTokenFromHandshake(socket);
  const authUserId = toIdString(socket.handshake.auth?.userId);
  const tokenUserId =
    decoded?.role === "user" ? toIdString(decoded.id || decoded.userId) : "";
  const bookingOwnerId = toIdString(bookingUserId);

  if (bookingOwnerId) {
    if (tokenUserId && tokenUserId === bookingOwnerId) return tokenUserId;
    if (authUserId && authUserId === bookingOwnerId) return authUserId;
  }

  if (tokenUserId) return tokenUserId;
  return authUserId;
};

const validateBookingForRole = async (bookingId, role, actorId) => {
  const booking = await Booking.findById(bookingId).select(
    "userId providerId status",
  );
  if (!booking) {
    return { ok: false, message: "Booking not found." };
  }

  if (!isTrackingAllowed(booking.status)) {
    return {
      ok: false,
      message: `Tracking is only available when booking status is "${TRACKING_ACTIVE_STATUS}".`,
    };
  }

  const actorIdStr = toIdString(actorId);
  if (!actorIdStr) {
    return { ok: false, message: "Authentication required." };
  }

  if (role === "user") {
    const bookingUserId = toIdString(booking.userId);
    if (!bookingUserId || bookingUserId !== actorIdStr) {
      return { ok: false, message: "You are not assigned to this booking." };
    }
  }

  if (role === "provider") {
    const bookingProviderId = toIdString(booking.providerId);
    if (!bookingProviderId || bookingProviderId !== actorIdStr) {
      return {
        ok: false,
        message: "Only the assigned service provider can track this booking.",
      };
    }
  }

  return { ok: true, booking };
};

const broadcastToRoom = (bookingId, event, payload) => {
  if (!ioRef) return;
  ioRef.to(getBookingIdString(bookingId)).emit(event, payload);
};

const endTrackingForBooking = (bookingId, reason = "ended") => {
  const roomId = getBookingIdString(bookingId);
  activeTrackingSessions.delete(roomId);
  broadcastToRoom(roomId, "trackingEnded", {
    bookingId: roomId,
    reason,
    updatedAt: new Date().toISOString(),
  });
};

const setupTrackingSocket = (io) => {
  ioRef = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinTrackingRoom", async (payload, ack) => {
      try {
        const { bookingId, role } = payload || {};
        if (!bookingId || !["user", "provider"].includes(role)) {
          const message = "bookingId and role (user|provider) are required.";
          if (typeof ack === "function") ack({ success: false, message });
          return;
        }

        let actorId = null;

        const bookingPreview = await Booking.findById(bookingId).select(
          "userId providerId status",
        );
        if (!bookingPreview) {
          const message = "Booking not found.";
          if (typeof ack === "function") ack({ success: false, message });
          return;
        }

        if (role === "user") {
          actorId = resolveUserActorId(socket, bookingPreview.userId);
          if (!actorId) {
            const message = "User authentication required. Please log in again.";
            if (typeof ack === "function") ack({ success: false, message });
            return;
          }
          socket.data.role = "user";
          socket.data.userId = actorId;
        }

        if (role === "provider") {
          const providerId = toIdString(
            socket.handshake.auth?.providerId || payload?.providerId,
          );
          if (!providerId) {
            const message = "Provider authentication required.";
            if (typeof ack === "function") ack({ success: false, message });
            return;
          }
          actorId = providerId;
          socket.data.role = "provider";
          socket.data.providerId = providerId;
        }

        const validation = await validateBookingForRole(
          bookingId,
          role,
          actorId,
        );
        if (!validation.ok) {
          if (typeof ack === "function") {
            ack({ success: false, message: validation.message });
          }
          return;
        }

        const roomId = getBookingIdString(bookingId);
        await socket.join(roomId);
        socket.data.bookingId = roomId;

        const existing = activeTrackingSessions.get(roomId);
        if (existing && typeof ack === "function") {
          ack({
            success: true,
            session: {
              ...existing,
              updatedAt: existing.updatedAt.toISOString(),
            },
          });
          socket.emit("receiveProviderLocation", {
            ...existing,
            updatedAt: existing.updatedAt.toISOString(),
          });
          return;
        }

        if (typeof ack === "function") {
          ack({ success: true, session: null });
        }
      } catch (error) {
        console.error("joinTrackingRoom error:", error);
        if (typeof ack === "function") {
          ack({ success: false, message: "Could not join tracking room." });
        }
      }
    });

    socket.on("providerLocationUpdate", async (payload) => {
      try {
        const { bookingId, latitude, longitude } = payload || {};
        const providerId = socket.data.providerId;

        console.log(`[Backend] providerLocationUpdate received: bookingId=${bookingId}, providerId=${providerId}, lat=${latitude}, lon=${longitude}`);

        if (
          socket.data.role !== "provider" ||
          !providerId ||
          !bookingId ||
          latitude == null ||
          longitude == null
        ) {
          console.warn("[Backend] Invalid provider location update - missing fields or wrong role", {
            role: socket.data.role,
            providerId,
            bookingId,
            latitude,
            longitude,
          });
          return;
        }

        const validation = await validateBookingForRole(
          bookingId,
          "provider",
          providerId,
        );
        if (!validation.ok) {
          console.warn("[Backend] Validation failed:", validation.message);
          return;
        }

        const roomId = getBookingIdString(bookingId);
        const booking = validation.booking;
        const updatedAt = new Date();

        const session = {
          bookingId: roomId,
          providerId: String(booking.providerId),
          userId: String(booking.userId),
          latitude: Number(latitude),
          longitude: Number(longitude),
          updatedAt,
        };

        activeTrackingSessions.set(roomId, session);

        const outbound = {
          ...session,
          updatedAt: updatedAt.toISOString(),
        };

        console.log(`[Backend] Broadcasting location to room ${roomId}:`, outbound);
        io.to(roomId).emit("receiveProviderLocation", outbound);
      } catch (error) {
        console.error("[Backend] providerLocationUpdate error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

const handleBookingStatusChange = (booking) => {
  if (!booking) return;
  const status = booking.status;
  const bookingId = getBookingIdString(booking._id);

  if (status === TRACKING_ACTIVE_STATUS) {
    return;
  }

  if (TRACKING_STOP_STATUSES.includes(status) && activeTrackingSessions.has(bookingId)) {
    endTrackingForBooking(bookingId, status);
  }
};

const getActiveTrackingSessions = () => activeTrackingSessions;

export {
  setupTrackingSocket,
  endTrackingForBooking,
  handleBookingStatusChange,
  getActiveTrackingSessions,
  TRACKING_ACTIVE_STATUS,
  TRACKING_STOP_STATUSES,
};
