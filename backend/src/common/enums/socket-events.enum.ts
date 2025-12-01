export enum SocketEvents {
  // Server → Client
  EMERGENCY_NEW = 'emergency:new',
  EMERGENCY_ASSIGNED = 'emergency:assigned',
  EMERGENCY_STATUS_UPDATE = 'emergency:status-update',
  HOSPITAL_BED_UPDATE = 'hospital:bed-update',
  NOTIFICATION_NEW = 'notification:new',

  // Client → Server
  JOIN_ROOM = 'join:room',
  LEAVE_ROOM = 'leave:room',

  // Connection events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
}

export enum SocketRooms {
  ADMINS = 'room:admins',
  DISPATCHERS = 'room:dispatchers',
  HOSPITALS = 'room:hospitals',
  RESCUE_TEAMS = 'room:rescue-teams',
  USERS = 'room:users',
}

// Helper to get room name by organization
export const getOrganizationRoom = (organizationId: string): string => {
  return `org:${organizationId}`;
};

// Helper to get user-specific room
export const getUserRoom = (userId: string): string => {
  return `user:${userId}`;
};

