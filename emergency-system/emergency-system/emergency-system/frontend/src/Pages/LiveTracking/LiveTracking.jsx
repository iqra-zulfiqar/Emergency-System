import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./LiveTracking.css";
import { API_URL } from "../../Config";
import { AuthContext } from "../../Context/AuthContext";
import { connectTrackingSocket } from "../../utils/trackingSocket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [31.4504, 73.135];

// ✅ FIX: This component now uses a ref to move the marker imperatively
// instead of relying on React re-renders which caused the map to remount
const LiveMarker = ({ position }) => {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!position?.[0] || !position?.[1]) return;

    if (!markerRef.current) {
      // Create marker once
      markerRef.current = L.marker(position).addTo(map);
      markerRef.current.bindPopup("Service provider (live)");
    } else {
      // Just move it — no remount, no flicker
      markerRef.current.setLatLng(position);
    }

    // Smoothly pan the map to the new position
    map.setView(position, map.getZoom() || 15, { animate: true });
  }, [position, map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  return null;
};

function LiveTracking() {
  const { userIsLogedIn, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [trackingUserId, setTrackingUserId] = useState(null);
  const [position, setPosition] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Loading tracking session...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Debug panel state
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    lastUpdateTime: null,
    lastAccuracy: null,
    updateCount: 0,
    socketConnected: false,
  });

  useEffect(() => {
    const isUser = role === "user" || userIsLogedIn;
    if (!isUser || role === "admin") {
      navigate("/login");
      return;
    }

    const loadActiveBooking = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/booking/active-tracking`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setBooking(res.data.booking);
          const ownerId =
            res.data.trackingUserId ||
            res.data.booking?.userId?._id ||
            res.data.booking?.userId;
          setTrackingUserId(ownerId ? String(ownerId) : null);
          setStatusMessage("Provider is on the way — live location updating.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "No active booking available for live tracking.";
        setError(message);
        setStatusMessage(message);
      } finally {
        setLoading(false);
      }
    };

    loadActiveBooking();
  }, [userIsLogedIn, role, navigate]);

  useEffect(() => {
    if (!booking?._id || !trackingUserId) return undefined;

    const socket = connectTrackingSocket({ userId: String(trackingUserId) });
    const bookingId = String(booking._id);

    console.log("[LiveTracking] Connecting for booking:", bookingId);

    const joinRoom = () => {
      if (!socket.connected) return;
      console.log("[LiveTracking] Joining tracking room:", bookingId);
      socket.emit(
        "joinTrackingRoom",
        {
          bookingId,
          role: "user",
        },
        (response) => {
          console.log("[LiveTracking] Room join response:", response);
          if (!response?.success) {
            console.error("[LiveTracking] Join failed:", response?.message);
            setError(response?.message || "Could not join tracking room.");
            return;
          }
          if (response.session) {
            const { latitude, longitude } = response.session;
            console.log("[LiveTracking] Existing session, initial position:", latitude, longitude);
            setPosition([latitude, longitude]);
          } else {
            console.log("[LiveTracking] No existing session, waiting for provider...");
          }
        }
      );
    };

    if (socket.connected) {
      joinRoom();
    }

    const onLocation = (data) => {
      console.log("[LiveTracking] Received provider location:", data);
      if (String(data.bookingId) !== bookingId) {
        console.warn("[LiveTracking] Booking ID mismatch:", data.bookingId);
        return;
      }
      if (data.latitude == null || data.longitude == null) {
        console.warn("[LiveTracking] Invalid coordinates:", data);
        return;
      }
      console.log("[LiveTracking] Updating position to:", [data.latitude, data.longitude]);

      // ✅ FIX: Always create a new array reference so React detects the change
      setPosition([data.latitude, data.longitude]);
      setStatusMessage(`Last updated: ${new Date(data.updatedAt).toLocaleTimeString()}`);
      setError("");
      
      // Update debug panel
      setDebugInfo((prev) => ({
        ...prev,
        lastUpdateTime: new Date(data.updatedAt).toLocaleTimeString(),
        updateCount: prev.updateCount + 1,
      }));
    };

    const onTrackingEnded = (data) => {
      console.log("[LiveTracking] Tracking ended:", data);
      if (String(data.bookingId) !== bookingId) return;
      setStatusMessage(`Tracking ended (${data.reason || "closed"}).`);
      setError("Live tracking has ended for this booking.");
    };

    socket.on("connect", () => {
      console.log("[LiveTracking] Socket connected");
      setDebugInfo((prev) => ({ ...prev, socketConnected: true }));
      joinRoom();
    });

    socket.on("disconnect", () => {
      console.log("[LiveTracking] Socket disconnected");
      setDebugInfo((prev) => ({ ...prev, socketConnected: false }));
    });

    socket.on("receiveProviderLocation", onLocation);
    socket.on("trackingEnded", onTrackingEnded);

    console.log("[LiveTracking] Event listeners attached");

    return () => {
      console.log("[LiveTracking] Cleaning up");
      socket.off("receiveProviderLocation", onLocation);
      socket.off("trackingEnded", onTrackingEnded);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [booking?._id, trackingUserId]);

  if (loading) {
    return (
      <div className="tracking-container">
        <p>Loading live tracking...</p>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <h1 className="title">Live Service Tracking</h1>

      <div className="tracking-card">
        <h2>Status</h2>
        <p className="status">{statusMessage}</p>
        {error && <p className="tracking-error">{error}</p>}
      </div>

      {booking && (
        <div className="info-box tracking-booking-info">
          <h3>Active booking</h3>
          <p><strong>Service:</strong> {booking.service}</p>
          <p><strong>Address:</strong> {booking.location}</p>
          {booking.providerId?.name && (
            <p><strong>Provider:</strong> {booking.providerId.name}</p>
          )}
        </div>
      )}

      <div className="map-container">
        {/* ✅ FIX: key is now STATIC — MapContainer never remounts on position change */}
        <MapContainer
          center={position || DEFAULT_CENTER}
          zoom={15}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* LiveMarker handles both the marker and map panning imperatively */}
          <LiveMarker position={position} />
        </MapContainer>
      </div>

      {!booking && !loading && (
        <div className="info-box">
          <p>
            Live tracking starts after a service provider <strong>accepts</strong>{" "}
            your emergency request. Book a service and wait for acceptance, then
            return here.
          </p>
          <button
            type="button"
            className="tracking-cta-btn"
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </button>
        </div>
      )}

      {false && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f5f5f5",
            border: "2px solid #ddd",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "monospace",
            lineHeight: "1.6",
          }}
        >
          <h4 style={{ marginTop: 0 }}>📊 Live Tracking Debug Panel</h4>
          <p>
            <strong>Socket Status:</strong>{" "}
            <span style={{ color: debugInfo.socketConnected ? "green" : "red" }}>
              {debugInfo.socketConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </span>
          </p>
          <p>
            <strong>Current Position:</strong> {position ? `[${position[0].toFixed(5)}, ${position[1].toFixed(5)}]` : "Waiting..."}
          </p>
          <p>
            <strong>Last Update:</strong> {debugInfo.lastUpdateTime || "Never"}
          </p>
          <p>
            <strong>Total Updates Received:</strong> {debugInfo.updateCount}
          </p>
          <p style={{ fontSize: "11px", color: "#666", marginTop: "10px" }}>
            💡 <strong>Testing Tips:</strong>
            <br />
            1. Provider must allow GPS access and keep dashboard open
            <br />
            2. Indoors, GPS accuracy is ±10-50 meters—move >5-10 meters to see change
            <br />
            3. Check browser console (F12) for detailed socket &amp; location logs
            <br />
            4. If "Total Updates" doesn't increase, provider may not be moving or GPS may be blocked
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveTracking;