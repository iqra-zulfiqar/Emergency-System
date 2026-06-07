// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Set these values to match the current booking.
// In a real app you'd read bookingId from the page URL or a data attribute.
const BOOKING_ID = document.getElementById("map").dataset.bookingId;  // e.g. "6649abc..."
const ROLE       = document.getElementById("map").dataset.role;        // "user" or "provider"
const PROVIDER_ID = document.getElementById("map").dataset.providerId; // only needed for provider

// ─── SOCKET INIT ─────────────────────────────────────────────────────────────
const socket = io({
  withCredentials: true,          // sends the JWT cookie automatically (needed for user role)
  auth: ROLE === "provider"
    ? { providerId: PROVIDER_ID } // provider sends its ID here — backend reads socket.handshake.auth.providerId
    : {},
});

// ─── MAP SETUP ───────────────────────────────────────────────────────────────
const map = L.map("map").setView([0, 0], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "RealTime Tracker",
}).addTo(map);

const markers = {};

// ─── JOIN ROOM FIRST, THEN START TRACKING ────────────────────────────────────
socket.on("connect", () => {
  console.log("[Socket] Connected:", socket.id);

  // ❶ CRITICAL: join the room before doing anything else.
  //    Backend sets socket.data.role + socket.data.providerId HERE.
  socket.emit(
    "joinTrackingRoom",
    { bookingId: BOOKING_ID, role: ROLE },
    (ack) => {
      console.log("[joinTrackingRoom] ack:", ack);

      if (!ack.success) {
        console.error("[joinTrackingRoom] Failed:", ack.message);
        return;
      }

      // If there's already a cached session, render it immediately
      if (ack.session) {
        renderLocation(ack.session);
      }

      // ❷ Provider: only start sending GPS updates AFTER the room is joined
      if (ROLE === "provider") {
        startProviderTracking();
      }
    }
  );
});

// ─── PROVIDER GPS LOOP ───────────────────────────────────────────────────────
function startProviderTracking() {
  if (!navigator.geolocation) {
    console.warn("[Geolocation] Not supported");
    return;
  }

  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`[GPS] lat=${latitude} lon=${longitude} acc=${accuracy}m`);

      // ❸ CRITICAL: always include bookingId in every update
      socket.emit("providerLocationUpdate", {
        bookingId: BOOKING_ID,
        latitude,
        longitude,
      });
    },
    (err) => console.error("[GPS error]", err),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,         // always get a fresh position — never use a cached one
    }
  );
}

// ─── USER: RECEIVE LOCATION UPDATES ──────────────────────────────────────────
socket.on("receiveProviderLocation", (data) => {
  console.log("[receiveProviderLocation]", data);
  renderLocation(data);
});

function renderLocation({ providerId, bookingId, latitude, longitude }) {
  if (latitude == null || longitude == null) return;

  const latlng = [latitude, longitude];
  map.setView(latlng);

  const id = providerId || bookingId || "provider";
  if (markers[id]) {
    markers[id].setLatLng(latlng);
  } else {
    markers[id] = L.marker(latlng).addTo(map);
  }
}

// ─── TRACKING ENDED ──────────────────────────────────────────────────────────
socket.on("trackingEnded", ({ reason }) => {
  console.log("[trackingEnded] reason:", reason);
  // Optionally show a banner: "Booking completed — tracking stopped"
});

socket.on("disconnect", () => console.log("[Socket] Disconnected"));
socket.on("connect_error", (e) => console.error("[Socket] Error:", e));