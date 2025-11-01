import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getAdminSocket() {
  if (socket) return socket;
  const url = import.meta.env.VITE_SOCKET_URL;
  socket = io(url, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
  });
  return socket;
}

export function disconnectAdminSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
