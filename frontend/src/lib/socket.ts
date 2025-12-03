"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  socket = io(API_URL, {
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("✅ WebSocket connected");
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

