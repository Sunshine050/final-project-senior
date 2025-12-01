/**
 * WebSocket Client Connection Example
 * 
 * This file demonstrates how to connect to the WebSocket server from a client application.
 * Copy and adapt this code for your frontend application.
 */

// ==================== Browser/React Example ====================

/*
import { io, Socket } from 'socket.io-client';

// Socket Events
const SocketEvents = {
  // Server → Client
  EMERGENCY_NEW: 'emergency:new',
  EMERGENCY_ASSIGNED: 'emergency:assigned',
  EMERGENCY_STATUS_UPDATE: 'emergency:status-update',
  HOSPITAL_BED_UPDATE: 'hospital:bed-update',
  NOTIFICATION_NEW: 'notification:new',

  // Client → Server
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
};

class WebSocketClient {
  private socket: Socket | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  connect(serverUrl: string = 'http://localhost:3000'): void {
    this.socket = io(serverUrl, {
      auth: {
        token: this.token, // JWT token from login
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      console.log('Socket ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    // Emergency events
    this.socket.on(SocketEvents.EMERGENCY_NEW, (data) => {
      console.log('🚨 New Emergency:', data);
      // Handle new emergency - show notification, update UI, etc.
    });

    this.socket.on(SocketEvents.EMERGENCY_ASSIGNED, (data) => {
      console.log('📋 Emergency Assigned:', data);
      // Handle assigned emergency
    });

    this.socket.on(SocketEvents.EMERGENCY_STATUS_UPDATE, (data) => {
      console.log('🔄 Status Update:', data);
      // Handle status update
    });

    // Hospital events
    this.socket.on(SocketEvents.HOSPITAL_BED_UPDATE, (data) => {
      console.log('🏥 Bed Update:', data);
      // Handle bed availability update
    });

    // Notification events
    this.socket.on(SocketEvents.NOTIFICATION_NEW, (data) => {
      console.log('🔔 New Notification:', data);
      // Show notification to user
    });
  }

  // Join a specific room
  joinRoom(room: string): void {
    if (!this.socket) return;
    
    this.socket.emit(SocketEvents.JOIN_ROOM, { room }, (response: { success: boolean; room: string }) => {
      if (response.success) {
        console.log(`Joined room: ${response.room}`);
      } else {
        console.error(`Failed to join room: ${response.room}`);
      }
    });
  }

  // Leave a room
  leaveRoom(room: string): void {
    if (!this.socket) return;
    
    this.socket.emit(SocketEvents.LEAVE_ROOM, { room }, (response: { success: boolean; room: string }) => {
      console.log(`Left room: ${response.room}`);
    });
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// ==================== Usage Example ====================

// After user login, get the JWT token
const jwtToken = 'your-jwt-token-from-login';

// Create WebSocket client
const wsClient = new WebSocketClient(jwtToken);

// Connect to server
wsClient.connect('http://localhost:3000');

// Join organization-specific room (optional)
wsClient.joinRoom('org:your-organization-id');

// Join role-specific room (optional - usually auto-joined on connect)
wsClient.joinRoom('room:hospitals');

// Cleanup on logout or component unmount
// wsClient.disconnect();

*/

// ==================== React Hook Example ====================

/*
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  serverUrl?: string;
  token: string;
  onEmergencyNew?: (data: any) => void;
  onEmergencyAssigned?: (data: any) => void;
  onStatusUpdate?: (data: any) => void;
  onBedUpdate?: (data: any) => void;
  onNotification?: (data: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    serverUrl = 'http://localhost:3000',
    token,
    onEmergencyNew,
    onEmergencyAssigned,
    onStatusUpdate,
    onBedUpdate,
    onNotification,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Event listeners
    if (onEmergencyNew) {
      socket.on('emergency:new', onEmergencyNew);
    }
    if (onEmergencyAssigned) {
      socket.on('emergency:assigned', onEmergencyAssigned);
    }
    if (onStatusUpdate) {
      socket.on('emergency:status-update', onStatusUpdate);
    }
    if (onBedUpdate) {
      socket.on('hospital:bed-update', onBedUpdate);
    }
    if (onNotification) {
      socket.on('notification:new', onNotification);
    }

    return () => {
      socket.disconnect();
    };
  }, [token, serverUrl]);

  const joinRoom = useCallback((room: string) => {
    socketRef.current?.emit('join:room', { room });
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketRef.current?.emit('leave:room', { room });
  }, []);

  return {
    isConnected,
    joinRoom,
    leaveRoom,
  };
}

// Usage in React component:
//
// function EmergencyDashboard() {
//   const { isConnected, joinRoom } = useWebSocket({
//     token: authToken,
//     onEmergencyNew: (data) => {
//       console.log('New emergency:', data);
//       // Update state, show notification, etc.
//     },
//     onStatusUpdate: (data) => {
//       console.log('Status update:', data);
//     },
//   });
//
//   useEffect(() => {
//     if (isConnected) {
//       joinRoom(`org:${organizationId}`);
//     }
//   }, [isConnected, organizationId]);
//
//   return (
//     <div>
//       <span>WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
//     </div>
//   );
// }

*/

// ==================== Node.js Client Example ====================

/*
import { io } from 'socket.io-client';

const token = 'your-jwt-token';

const socket = io('http://localhost:3000', {
  auth: { token },
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  
  // Join rooms
  socket.emit('join:room', { room: 'room:dispatchers' });
});

socket.on('emergency:new', (data) => {
  console.log('New Emergency:', data);
});

socket.on('emergency:status-update', (data) => {
  console.log('Status Update:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
*/

export {};

