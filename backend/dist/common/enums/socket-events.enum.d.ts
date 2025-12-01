export declare enum SocketEvents {
    EMERGENCY_NEW = "emergency:new",
    EMERGENCY_ASSIGNED = "emergency:assigned",
    EMERGENCY_STATUS_UPDATE = "emergency:status-update",
    HOSPITAL_BED_UPDATE = "hospital:bed-update",
    NOTIFICATION_NEW = "notification:new",
    JOIN_ROOM = "join:room",
    LEAVE_ROOM = "leave:room",
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    ERROR = "error"
}
export declare enum SocketRooms {
    ADMINS = "room:admins",
    DISPATCHERS = "room:dispatchers",
    HOSPITALS = "room:hospitals",
    RESCUE_TEAMS = "room:rescue-teams",
    USERS = "room:users"
}
export declare const getOrganizationRoom: (organizationId: string) => string;
export declare const getUserRoom: (userId: string) => string;
