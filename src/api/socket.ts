import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getAdminSocket() {
  if (socket) return socket;
  const token = localStorage.getItem("adminToken");
  const url = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_BACKEND_API_URL?.replace(/\/api$/, "") ?? "http://localhost:5000");
  socket = io(url, {
    transports: ["websocket", "polling"],
    auth: { token },
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
