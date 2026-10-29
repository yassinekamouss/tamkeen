import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getAdminSocket() {
  if (socket) return socket;
  const rawUrl = import.meta.env.VITE_SOCKET_URL;
  // If VITE_SOCKET_URL is empty or undefined, Socket.IO connects to current window origin on path /socket.io
  const url = rawUrl && rawUrl.trim() !== "" ? rawUrl : undefined;
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
