"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppWebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const socket_events_enum_1 = require("../../common/enums/socket-events.enum");
const enums_1 = require("../../common/enums");
const ws_jwt_guard_1 = require("./guards/ws-jwt.guard");
let AppWebSocketGateway = AppWebSocketGateway_1 = class AppWebSocketGateway {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AppWebSocketGateway_1.name);
        this.connectedClients = new Map();
    }
    afterInit() {
        this.logger.log('WebSocket Gateway initialized');
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                this.logger.warn(`Client ${client.id} connection rejected: No token provided`);
                client.disconnect();
                return;
            }
            const payload = await this.verifyToken(token);
            if (!payload) {
                this.logger.warn(`Client ${client.id} connection rejected: Invalid token`);
                client.disconnect();
                return;
            }
            client.user = payload;
            this.connectedClients.set(client.id, client);
            await this.autoJoinRooms(client, payload);
            this.logger.log(`Client connected: ${client.id} | User: ${payload.email} | Role: ${payload.role}`);
        }
        catch (error) {
            this.logger.error(`Connection error for client ${client.id}:`, error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedClients.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinRoom(client, payload) {
        const { room } = payload;
        if (!this.canAccessRoom(client.user, room)) {
            this.logger.warn(`User ${client.user.email} denied access to room: ${room}`);
            return { success: false, room };
        }
        await client.join(room);
        this.logger.log(`Client ${client.id} joined room: ${room}`);
        return { success: true, room };
    }
    async handleLeaveRoom(client, payload) {
        const { room } = payload;
        await client.leave(room);
        this.logger.log(`Client ${client.id} left room: ${room}`);
        return { success: true, room };
    }
    emitNewEmergency(payload) {
        this.server.to(socket_events_enum_1.SocketRooms.DISPATCHERS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_NEW, payload);
        this.server.to(socket_events_enum_1.SocketRooms.ADMINS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_NEW, payload);
        this.server.to(socket_events_enum_1.SocketRooms.HOSPITALS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_NEW, payload);
        this.logger.log(`Emitted emergency:new for emergency ${payload.emergencyId}`);
    }
    emitEmergencyAssigned(payload) {
        if (payload.assignedHospitalId) {
            this.server
                .to((0, socket_events_enum_1.getOrganizationRoom)(payload.assignedHospitalId))
                .emit(socket_events_enum_1.SocketEvents.EMERGENCY_ASSIGNED, payload);
        }
        if (payload.assignedRescueTeamId) {
            this.server
                .to((0, socket_events_enum_1.getOrganizationRoom)(payload.assignedRescueTeamId))
                .emit(socket_events_enum_1.SocketEvents.EMERGENCY_ASSIGNED, payload);
        }
        this.server.to(socket_events_enum_1.SocketRooms.DISPATCHERS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_ASSIGNED, payload);
        this.server.to(socket_events_enum_1.SocketRooms.ADMINS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_ASSIGNED, payload);
        this.logger.log(`Emitted emergency:assigned for emergency ${payload.emergencyId}`);
    }
    emitEmergencyStatusUpdate(payload) {
        if (payload.assignedHospitalId) {
            this.server
                .to((0, socket_events_enum_1.getOrganizationRoom)(payload.assignedHospitalId))
                .emit(socket_events_enum_1.SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
        }
        if (payload.assignedRescueTeamId) {
            this.server
                .to((0, socket_events_enum_1.getOrganizationRoom)(payload.assignedRescueTeamId))
                .emit(socket_events_enum_1.SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
        }
        this.server.to(socket_events_enum_1.SocketRooms.DISPATCHERS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
        this.server.to(socket_events_enum_1.SocketRooms.ADMINS).emit(socket_events_enum_1.SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
        this.logger.log(`Emitted emergency:status-update for emergency ${payload.emergencyId} - Status: ${payload.status}`);
    }
    emitHospitalBedUpdate(payload) {
        this.server.to(socket_events_enum_1.SocketRooms.DISPATCHERS).emit(socket_events_enum_1.SocketEvents.HOSPITAL_BED_UPDATE, payload);
        this.server.to(socket_events_enum_1.SocketRooms.ADMINS).emit(socket_events_enum_1.SocketEvents.HOSPITAL_BED_UPDATE, payload);
        this.server
            .to((0, socket_events_enum_1.getOrganizationRoom)(payload.hospitalId))
            .emit(socket_events_enum_1.SocketEvents.HOSPITAL_BED_UPDATE, payload);
        this.logger.log(`Emitted hospital:bed-update for hospital ${payload.hospitalId} - Available: ${payload.availableBeds}/${payload.totalBeds}`);
    }
    emitNotification(payload) {
        if (payload.targetUserId) {
            this.server
                .to((0, socket_events_enum_1.getUserRoom)(payload.targetUserId))
                .emit(socket_events_enum_1.SocketEvents.NOTIFICATION_NEW, payload);
        }
        if (payload.targetOrganizationId) {
            this.server
                .to((0, socket_events_enum_1.getOrganizationRoom)(payload.targetOrganizationId))
                .emit(socket_events_enum_1.SocketEvents.NOTIFICATION_NEW, payload);
        }
        if (payload.targetRole) {
            const roomName = this.getRoomByRole(payload.targetRole);
            if (roomName) {
                this.server.to(roomName).emit(socket_events_enum_1.SocketEvents.NOTIFICATION_NEW, payload);
            }
        }
        this.logger.log(`Emitted notification:new - Type: ${payload.type}`);
    }
    emitToAll(event, payload) {
        this.server.emit(event, payload);
    }
    emitToRoom(room, event, payload) {
        this.server.to(room).emit(event, payload);
    }
    emitToUser(userId, event, payload) {
        this.server.to((0, socket_events_enum_1.getUserRoom)(userId)).emit(event, payload);
    }
    emitToOrganization(organizationId, event, payload) {
        this.server.to((0, socket_events_enum_1.getOrganizationRoom)(organizationId)).emit(event, payload);
    }
    extractToken(client) {
        const authToken = client.handshake.auth?.token;
        if (authToken) {
            return authToken.replace('Bearer ', '');
        }
        const queryToken = client.handshake.query?.token;
        if (queryToken) {
            return queryToken;
        }
        const authHeader = client.handshake.headers?.authorization;
        if (authHeader) {
            return authHeader.replace('Bearer ', '');
        }
        return null;
    }
    async verifyToken(token) {
        try {
            const secret = this.configService.get('JWT_SECRET') || 'default-secret-key';
            const payload = await this.jwtService.verifyAsync(token, { secret });
            return payload;
        }
        catch {
            return null;
        }
    }
    async autoJoinRooms(client, user) {
        await client.join((0, socket_events_enum_1.getUserRoom)(user.sub));
        if (user.organizationId) {
            await client.join((0, socket_events_enum_1.getOrganizationRoom)(user.organizationId));
        }
        const roleRoom = this.getRoomByRole(user.role);
        if (roleRoom) {
            await client.join(roleRoom);
        }
    }
    getRoomByRole(role) {
        switch (role) {
            case enums_1.Role.ADMIN:
                return socket_events_enum_1.SocketRooms.ADMINS;
            case enums_1.Role.DISPATCHER:
                return socket_events_enum_1.SocketRooms.DISPATCHERS;
            case enums_1.Role.HOSPITAL_STAFF:
                return socket_events_enum_1.SocketRooms.HOSPITALS;
            case enums_1.Role.RESCUE_TEAM:
                return socket_events_enum_1.SocketRooms.RESCUE_TEAMS;
            case enums_1.Role.USER:
                return socket_events_enum_1.SocketRooms.USERS;
            default:
                return null;
        }
    }
    canAccessRoom(user, room) {
        if (user.role === enums_1.Role.ADMIN) {
            return true;
        }
        if (room === (0, socket_events_enum_1.getUserRoom)(user.sub)) {
            return true;
        }
        if (user.organizationId && room === (0, socket_events_enum_1.getOrganizationRoom)(user.organizationId)) {
            return true;
        }
        const userRoleRoom = this.getRoomByRole(user.role);
        if (room === userRoleRoom) {
            return true;
        }
        return false;
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
    async getClientsInRoom(room) {
        const sockets = await this.server.in(room).fetchSockets();
        return sockets.map((s) => s.id);
    }
};
exports.AppWebSocketGateway = AppWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_events_enum_1.SocketEvents.JOIN_ROOM),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppWebSocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_events_enum_1.SocketEvents.LEAVE_ROOM),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppWebSocketGateway.prototype, "handleLeaveRoom", null);
exports.AppWebSocketGateway = AppWebSocketGateway = AppWebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AppWebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map