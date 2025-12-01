import { Socket } from 'socket.io';
import { JwtPayload } from '../decorators/current-user.decorator';
export interface AuthenticatedSocket extends Socket {
    user: JwtPayload;
}
export interface JoinRoomPayload {
    room: string;
}
export interface LeaveRoomPayload {
    room: string;
}
export interface EmergencyEventPayload {
    emergencyId: string;
    status?: string;
    severity?: string;
    assignedHospitalId?: string;
    assignedRescueTeamId?: string;
    location?: {
        type: string;
        coordinates: [number, number];
    };
    callerName?: string;
    description?: string;
    timestamp: Date;
}
export interface HospitalBedUpdatePayload {
    hospitalId: string;
    hospitalName: string;
    totalBeds: number;
    availableBeds: number;
    timestamp: Date;
}
export interface NotificationPayload {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    targetUserId?: string;
    targetOrganizationId?: string;
    targetRole?: string;
    timestamp: Date;
}
