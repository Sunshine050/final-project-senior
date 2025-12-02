'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  EmergencyEventPayload,
  HospitalBedUpdatePayload,
  NotificationPayload,
} from '@/types/emergency';
import authService from '@/services/authService';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

// Socket Events
export const SocketEvents = {
  // Server → Client
  EMERGENCY_NEW: 'emergency:new',
  EMERGENCY_ASSIGNED: 'emergency:assigned',
  EMERGENCY_STATUS_UPDATE: 'emergency:status-update',
  HOSPITAL_BED_UPDATE: 'hospital:bed-update',
  NOTIFICATION_NEW: 'notification:new',

  // Client → Server
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
} as const;

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onEmergencyNew?: (data: EmergencyEventPayload) => void;
  onEmergencyAssigned?: (data: EmergencyEventPayload) => void;
  onStatusUpdate?: (data: EmergencyEventPayload) => void;
  onBedUpdate?: (data: HospitalBedUpdatePayload) => void;
  onNotification?: (data: NotificationPayload) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  joinedRooms: Set<string>;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    onEmergencyNew,
    onEmergencyAssigned,
    onStatusUpdate,
    onBedUpdate,
    onNotification,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    const token = authService.getToken();

    if (!token) {
      console.warn('WebSocket: No auth token available');
      return;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket: Connected', socket.id);
      setIsConnected(true);
      onConnect?.();
    });


    socket.on('connect_error', (error) => {
      console.error('WebSocket: Connection error', error.message);
      setIsConnected(false);
      onError?.(error);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket: Disconnected', reason);
      setIsConnected(false);
      setJoinedRooms(new Set());
      onDisconnect?.(reason);
      
      // Auto-reconnect if not manually disconnected
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        setTimeout(() => {
          if (authService.isAuthenticated() && !socketRef.current?.connected) {
            console.log('WebSocket: Attempting to reconnect...');
            connect();
          }
        }, 2000);
      }
    });

    // Emergency events
    socket.on(SocketEvents.EMERGENCY_NEW, (data: EmergencyEventPayload) => {
      console.log('WebSocket: New emergency', data);
      onEmergencyNew?.(data);
    });

    socket.on(SocketEvents.EMERGENCY_ASSIGNED, (data: EmergencyEventPayload) => {
      console.log('WebSocket: Emergency assigned', data);
      onEmergencyAssigned?.(data);
    });

    socket.on(SocketEvents.EMERGENCY_STATUS_UPDATE, (data: EmergencyEventPayload) => {
      console.log('WebSocket: Status update', data);
      onStatusUpdate?.(data);
    });

    // Hospital events
    socket.on(SocketEvents.HOSPITAL_BED_UPDATE, (data: HospitalBedUpdatePayload) => {
      console.log('WebSocket: Bed update', data);
      onBedUpdate?.(data);
    });

    // Notification events
    socket.on(SocketEvents.NOTIFICATION_NEW, (data: NotificationPayload) => {
      console.log('WebSocket: New notification', data);
      onNotification?.(data);
    });
  }, [onConnect, onDisconnect, onError, onEmergencyNew, onEmergencyAssigned, onStatusUpdate, onBedUpdate, onNotification]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setJoinedRooms(new Set());
    }
  }, []);

  const joinRoom = useCallback((room: string) => {
    if (!socketRef.current?.connected) {
      console.warn('WebSocket: Cannot join room - not connected');
      return;
    }

    socketRef.current.emit(
      SocketEvents.JOIN_ROOM,
      { room },
      (response: { success: boolean; room: string }) => {
        if (response.success) {
          console.log('WebSocket: Joined room', room);
          setJoinedRooms((prev) => new Set(prev).add(room));
        } else {
          console.error('WebSocket: Failed to join room', room);
        }
      }
    );
  }, []);

  const leaveRoom = useCallback((room: string) => {
    if (!socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit(
      SocketEvents.LEAVE_ROOM,
      { room },
      (response: { success: boolean; room: string }) => {
        console.log('WebSocket: Left room', room);
        setJoinedRooms((prev) => {
          const newSet = new Set(prev);
          newSet.delete(room);
          return newSet;
        });
      }
    );
  }, []);

  // Auto-connect on mount if token exists
  useEffect(() => {
    if (autoConnect && authService.isAuthenticated()) {
      // Delay connection slightly to ensure auth is ready
      const timer = setTimeout(() => {
        connect();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        disconnect();
      };
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]); // Remove connect/disconnect from deps to prevent re-connection loops

  return {
    isConnected,
    socket: socketRef.current,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    joinedRooms,
  };
}

export default useWebSocket;

