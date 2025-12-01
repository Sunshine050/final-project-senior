"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoom = exports.getOrganizationRoom = exports.SocketRooms = exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["EMERGENCY_NEW"] = "emergency:new";
    SocketEvents["EMERGENCY_ASSIGNED"] = "emergency:assigned";
    SocketEvents["EMERGENCY_STATUS_UPDATE"] = "emergency:status-update";
    SocketEvents["HOSPITAL_BED_UPDATE"] = "hospital:bed-update";
    SocketEvents["NOTIFICATION_NEW"] = "notification:new";
    SocketEvents["JOIN_ROOM"] = "join:room";
    SocketEvents["LEAVE_ROOM"] = "leave:room";
    SocketEvents["CONNECTION"] = "connection";
    SocketEvents["DISCONNECT"] = "disconnect";
    SocketEvents["ERROR"] = "error";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
var SocketRooms;
(function (SocketRooms) {
    SocketRooms["ADMINS"] = "room:admins";
    SocketRooms["DISPATCHERS"] = "room:dispatchers";
    SocketRooms["HOSPITALS"] = "room:hospitals";
    SocketRooms["RESCUE_TEAMS"] = "room:rescue-teams";
    SocketRooms["USERS"] = "room:users";
})(SocketRooms || (exports.SocketRooms = SocketRooms = {}));
const getOrganizationRoom = (organizationId) => {
    return `org:${organizationId}`;
};
exports.getOrganizationRoom = getOrganizationRoom;
const getUserRoom = (userId) => {
    return `user:${userId}`;
};
exports.getUserRoom = getUserRoom;
//# sourceMappingURL=socket-events.enum.js.map