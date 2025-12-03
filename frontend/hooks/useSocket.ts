"use client";

import { useEffect, useRef } from "react";
import { initSocket, disconnectSocket, getSocket } from "@/lib/socket";

export function useSocket(token: string | null) {
  const socketRef = useRef<ReturnType<typeof initSocket> | null>(null);

  useEffect(() => {
    if (token) {
      socketRef.current = initSocket(token);

      return () => {
        disconnectSocket();
      };
    }
  }, [token]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
}

