import { io } from "socket.io-client";
import { API_URL } from "../Config";

let socketInstance = null;

export const getTrackingSocket = () => {
  if (!socketInstance) {
    socketInstance = io(API_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socketInstance;
};

export const connectTrackingSocket = (auth = {}) => {
  const socket = getTrackingSocket();

  const normalizedAuth = {};
  if (auth.userId) normalizedAuth.userId = String(auth.userId);
  if (auth.providerId) normalizedAuth.providerId = String(auth.providerId);

  // If auth changes while the socket is already connected, reconnect so
  // the server receives the updated handshake data.
  const authChanged =
    JSON.stringify(socket.auth) !== JSON.stringify(normalizedAuth);
  socket.auth = normalizedAuth;
  if (socket.connected && authChanged) {
    socket.disconnect();
  }

  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectTrackingSocket = () => {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }
};
