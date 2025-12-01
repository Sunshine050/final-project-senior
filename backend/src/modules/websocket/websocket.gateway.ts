import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticatedSocket,
  JoinRoomPayload,
  LeaveRoomPayload,
  EmergencyEventPayload,
  HospitalBedUpdatePayload,
  NotificationPayload,
} from '../../common/interfaces/socket.interface';
import {
  SocketEvents,
  SocketRooms,
  getOrganizationRoom,
  getUserRoom,
} from '../../common/enums/socket-events.enum';
import { Role } from '../../common/enums';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class AppWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppWebSocketGateway.name);
  private connectedClients: Map<string, AuthenticatedSocket> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(): void {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
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

      // Attach user to socket
      client.user = payload;
      this.connectedClients.set(client.id, client);

      // Auto-join rooms based on role
      await this.autoJoinRooms(client, payload);

      this.logger.log(
        `Client connected: ${client.id} | User: ${payload.email} | Role: ${payload.role}`,
      );
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  @UseGuards(WsJwtGuard)
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: JoinRoomPayload,
  ): Promise<{ success: boolean; room: string }> {
    const { room } = payload;

    // Validate room access
    if (!this.canAccessRoom(client.user, room)) {
      this.logger.warn(
        `User ${client.user.email} denied access to room: ${room}`,
      );
      return { success: false, room };
    }

    await client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { success: true, room };
  }

  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  @UseGuards(WsJwtGuard)
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: LeaveRoomPayload,
  ): Promise<{ success: boolean; room: string }> {
    const { room } = payload;
    await client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    return { success: true, room };
  }

  // ==================== Emit Methods ====================

  /**
   * Emit new emergency event
   */
  emitNewEmergency(payload: EmergencyEventPayload): void {
    // Emit to dispatchers and admins
    this.server.to(SocketRooms.DISPATCHERS).emit(SocketEvents.EMERGENCY_NEW, payload);
    this.server.to(SocketRooms.ADMINS).emit(SocketEvents.EMERGENCY_NEW, payload);
    
    // Also emit to all hospitals
    this.server.to(SocketRooms.HOSPITALS).emit(SocketEvents.EMERGENCY_NEW, payload);
    
    this.logger.log(`Emitted emergency:new for emergency ${payload.emergencyId}`);
  }

  /**
   * Emit emergency assigned event
   */
  emitEmergencyAssigned(payload: EmergencyEventPayload): void {
    // Emit to specific hospital
    if (payload.assignedHospitalId) {
      this.server
        .to(getOrganizationRoom(payload.assignedHospitalId))
        .emit(SocketEvents.EMERGENCY_ASSIGNED, payload);
    }

    // Emit to specific rescue team
    if (payload.assignedRescueTeamId) {
      this.server
        .to(getOrganizationRoom(payload.assignedRescueTeamId))
        .emit(SocketEvents.EMERGENCY_ASSIGNED, payload);
    }

    // Also emit to dispatchers and admins
    this.server.to(SocketRooms.DISPATCHERS).emit(SocketEvents.EMERGENCY_ASSIGNED, payload);
    this.server.to(SocketRooms.ADMINS).emit(SocketEvents.EMERGENCY_ASSIGNED, payload);

    this.logger.log(`Emitted emergency:assigned for emergency ${payload.emergencyId}`);
  }

  /**
   * Emit emergency status update
   */
  emitEmergencyStatusUpdate(payload: EmergencyEventPayload): void {
    // Emit to assigned hospital
    if (payload.assignedHospitalId) {
      this.server
        .to(getOrganizationRoom(payload.assignedHospitalId))
        .emit(SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
    }

    // Emit to assigned rescue team
    if (payload.assignedRescueTeamId) {
      this.server
        .to(getOrganizationRoom(payload.assignedRescueTeamId))
        .emit(SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
    }

    // Emit to dispatchers and admins
    this.server.to(SocketRooms.DISPATCHERS).emit(SocketEvents.EMERGENCY_STATUS_UPDATE, payload);
    this.server.to(SocketRooms.ADMINS).emit(SocketEvents.EMERGENCY_STATUS_UPDATE, payload);

    this.logger.log(
      `Emitted emergency:status-update for emergency ${payload.emergencyId} - Status: ${payload.status}`,
    );
  }

  /**
   * Emit hospital bed update
   */
  emitHospitalBedUpdate(payload: HospitalBedUpdatePayload): void {
    // Emit to dispatchers and admins
    this.server.to(SocketRooms.DISPATCHERS).emit(SocketEvents.HOSPITAL_BED_UPDATE, payload);
    this.server.to(SocketRooms.ADMINS).emit(SocketEvents.HOSPITAL_BED_UPDATE, payload);

    // Emit to the specific hospital
    this.server
      .to(getOrganizationRoom(payload.hospitalId))
      .emit(SocketEvents.HOSPITAL_BED_UPDATE, payload);

    this.logger.log(
      `Emitted hospital:bed-update for hospital ${payload.hospitalId} - Available: ${payload.availableBeds}/${payload.totalBeds}`,
    );
  }

  /**
   * Emit notification
   */
  emitNotification(payload: NotificationPayload): void {
    // Send to specific user
    if (payload.targetUserId) {
      this.server
        .to(getUserRoom(payload.targetUserId))
        .emit(SocketEvents.NOTIFICATION_NEW, payload);
    }

    // Send to specific organization
    if (payload.targetOrganizationId) {
      this.server
        .to(getOrganizationRoom(payload.targetOrganizationId))
        .emit(SocketEvents.NOTIFICATION_NEW, payload);
    }

    // Send to specific role
    if (payload.targetRole) {
      const roomName = this.getRoomByRole(payload.targetRole);
      if (roomName) {
        this.server.to(roomName).emit(SocketEvents.NOTIFICATION_NEW, payload);
      }
    }

    this.logger.log(`Emitted notification:new - Type: ${payload.type}`);
  }

  /**
   * Emit to all connected clients
   */
  emitToAll(event: string, payload: unknown): void {
    this.server.emit(event, payload);
  }

  /**
   * Emit to specific room
   */
  emitToRoom(room: string, event: string, payload: unknown): void {
    this.server.to(room).emit(event, payload);
  }

  /**
   * Emit to specific user
   */
  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server.to(getUserRoom(userId)).emit(event, payload);
  }

  /**
   * Emit to specific organization
   */
  emitToOrganization(organizationId: string, event: string, payload: unknown): void {
    this.server.to(getOrganizationRoom(organizationId)).emit(event, payload);
  }

  // ==================== Private Methods ====================

  private extractToken(client: AuthenticatedSocket): string | null {
    // Try to get token from handshake auth
    const authToken = client.handshake.auth?.token as string | undefined;
    if (authToken) {
      return authToken.replace('Bearer ', '');
    }

    // Try to get token from query params
    const queryToken = client.handshake.query?.token as string | undefined;
    if (queryToken) {
      return queryToken;
    }

    // Try to get token from headers
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader) {
      return authHeader.replace('Bearer ', '');
    }

    return null;
  }

  private async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret-key';
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
      return payload;
    } catch {
      return null;
    }
  }

  private async autoJoinRooms(
    client: AuthenticatedSocket,
    user: JwtPayload,
  ): Promise<void> {
    // Join user-specific room
    await client.join(getUserRoom(user.sub));

    // Join organization room if applicable
    if (user.organizationId) {
      await client.join(getOrganizationRoom(user.organizationId));
    }

    // Join role-based room
    const roleRoom = this.getRoomByRole(user.role);
    if (roleRoom) {
      await client.join(roleRoom);
    }
  }

  private getRoomByRole(role: string): string | null {
    switch (role) {
      case Role.ADMIN:
        return SocketRooms.ADMINS;
      case Role.DISPATCHER:
        return SocketRooms.DISPATCHERS;
      case Role.HOSPITAL_STAFF:
        return SocketRooms.HOSPITALS;
      case Role.RESCUE_TEAM:
        return SocketRooms.RESCUE_TEAMS;
      case Role.USER:
        return SocketRooms.USERS;
      default:
        return null;
    }
  }

  private canAccessRoom(user: JwtPayload, room: string): boolean {
    // Admins can access any room
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if it's the user's own room
    if (room === getUserRoom(user.sub)) {
      return true;
    }

    // Check if it's the user's organization room
    if (user.organizationId && room === getOrganizationRoom(user.organizationId)) {
      return true;
    }

    // Check role-based room access
    const userRoleRoom = this.getRoomByRole(user.role);
    if (room === userRoleRoom) {
      return true;
    }

    return false;
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Get clients in a room
   */
  async getClientsInRoom(room: string): Promise<string[]> {
    const sockets = await this.server.in(room).fetchSockets();
    return sockets.map((s) => s.id);
  }
}

