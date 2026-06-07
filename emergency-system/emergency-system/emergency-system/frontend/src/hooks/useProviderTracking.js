import { useEffect, useRef } from "react";
import { connectTrackingSocket } from "../utils/trackingSocket";

/**
 * Sends provider GPS to booking rooms when status is accepted.
 * @param {string[]} bookingIds
 * @param {string|null} providerId
 */
export const useProviderTracking = (bookingIds, providerId) => {
  const watchIdRef = useRef(null);
  const joinedRoomsRef = useRef(new Set());

  useEffect(() => {
    if (!providerId || !bookingIds?.length) {
      console.log("[Provider Tracking] Skipping - providerId:", providerId, 'bookingIds:', bookingIds);
      return undefined;
    }

    console.log("[Provider Tracking] Starting for provider:", providerId, "bookings:", bookingIds);
    const socket = connectTrackingSocket({ providerId });

    const joinRooms = async () => {
      const joinPromises = bookingIds.map((bookingId) => {
        const roomKey = String(bookingId);
        if (joinedRoomsRef.current.has(roomKey)) {
          console.log("[Provider Tracking] Already joined room:", roomKey);
          return Promise.resolve({ success: true, roomKey });
        }

        console.log("[Provider Tracking] Joining room:", roomKey);
        return new Promise((resolve) => {
          socket.emit(
            "joinTrackingRoom",
            { bookingId: roomKey, role: "provider", providerId },
            (response) => {
              console.log(
                "[Provider Tracking] Room join response for:",
                roomKey,
                "response:",
                response,
              );
              if (response?.success) {
                joinedRoomsRef.current.add(roomKey);
                console.log("[Provider Tracking] Successfully joined room:", roomKey);
              } else {
                console.error(
                  "[Provider Tracking] Failed to join room:",
                  roomKey,
                  "message:",
                  response?.message,
                );
              }
              resolve(response);
            },
          );
        });
      });

      await Promise.all(joinPromises);
    };

    const startLocationWatch = () => {
      if (!navigator.geolocation) {
        console.warn("[Provider Tracking] Geolocation not supported");
        return;
      }

      console.log("[Provider Tracking] Starting geolocation watchPosition");
      let lastEmittedLat = null;
      let lastEmittedLon = null;
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`[Provider Tracking] Location update: lat=${latitude}, lon=${longitude}, accuracy=${accuracy}m`);
          
          // Only emit if location has changed by more than 5 meters
          // This reduces noise from GPS jitter indoors
          const shouldEmit =
            lastEmittedLat === null ||
            lastEmittedLon === null ||
            Math.abs(latitude - lastEmittedLat) > 0.00001 || // ~1 meter
            Math.abs(longitude - lastEmittedLon) > 0.00001;
          
          if (shouldEmit) {
            console.log(`[Provider Tracking] ✅ Emitting location (changed by >5m)`);
            lastEmittedLat = latitude;
            lastEmittedLon = longitude;
            
            bookingIds.forEach((bookingId) => {
              const roomKey = String(bookingId);
              console.log(`[Provider Tracking] Emitting location for booking: ${roomKey}`);
              socket.emit("providerLocationUpdate", {
                bookingId: roomKey,
                latitude,
                longitude,
              });
            });
          } else {
            console.log(`[Provider Tracking] ⏭️ Skipped emit—location moved <1 meter (GPS jitter)`);
          }
        },
        (error) => {
          console.error("[Provider Tracking] Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,  // Use GPS over wifi triangulation
          timeout: 10000,
          maximumAge: 0,  // Always get fresh position
        },
      );
    };

    joinRooms()
      .then(() => {
        startLocationWatch();
      })
      .catch((error) => {
        console.error("[Provider Tracking] Failed to join tracking rooms:", error);
        startLocationWatch();
      });

    return () => {
      console.log("[Provider Tracking] Cleaning up");
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      joinedRoomsRef.current.clear();
    };
  }, [bookingIds.join(","), providerId]);
};
