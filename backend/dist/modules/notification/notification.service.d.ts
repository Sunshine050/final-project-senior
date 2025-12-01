import { Model } from 'mongoose';
import { NotificationDocument, NotificationType } from '../../schemas/notification.schema';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { CreateNotificationDto, NotificationResponseDto, NotificationListResponseDto } from './dto';
export declare class NotificationService {
    private notificationModel;
    private readonly wsGateway;
    constructor(notificationModel: Model<NotificationDocument>, wsGateway: AppWebSocketGateway);
    create(createDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    createEmergencyNotification(type: NotificationType, title: string, message: string, emergencyId: string, targetOrganizationId?: string, targetRole?: string): Promise<NotificationResponseDto>;
    getUserNotifications(userId: string, organizationId?: string, role?: string, limit?: number): Promise<NotificationListResponseDto>;
    markAsRead(notificationId: string, userId: string): Promise<NotificationResponseDto>;
    markAllAsRead(userId: string, organizationId?: string, role?: string): Promise<number>;
    deleteNotification(notificationId: string): Promise<void>;
    private emitNotification;
    private mapToResponseDto;
}
