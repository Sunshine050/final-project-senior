import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket, JoinRoomPayload, LeaveRoomPayload, EmergencyEventPayload, HospitalBedUpdatePayload, NotificationPayload } from '../../common/interfaces/socket.interface';
export declare class AppWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(jwtService: JwtService, configService: ConfigService);
    afterInit(): void;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, payload: JoinRoomPayload): Promise<{
        success: boolean;
        room: string;
    }>;
    handleLeaveRoom(client: AuthenticatedSocket, payload: LeaveRoomPayload): Promise<{
        success: boolean;
        room: string;
    }>;
    emitNewEmergency(payload: EmergencyEventPayload): void;
    emitEmergencyAssigned(payload: EmergencyEventPayload): void;
    emitEmergencyStatusUpdate(payload: EmergencyEventPayload): void;
    emitHospitalBedUpdate(payload: HospitalBedUpdatePayload): void;
    emitNotification(payload: NotificationPayload): void;
    emitToAll(event: string, payload: unknown): void;
    emitToRoom(room: string, event: string, payload: unknown): void;
    emitToUser(userId: string, event: string, payload: unknown): void;
    emitToOrganization(organizationId: string, event: string, payload: unknown): void;
    private extractToken;
    private verifyToken;
    private autoJoinRooms;
    private getRoomByRole;
    private canAccessRoom;
    getConnectedClientsCount(): number;
    getClientsInRoom(room: string): Promise<string[]>;
}
