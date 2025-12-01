import { NotificationType } from '../../../schemas/notification.schema';
export declare class NotificationResponseDto {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    targetUserId?: string;
    targetOrganizationId?: string;
    targetRole?: string;
    isRead: boolean;
    readAt?: Date;
    emergencyId?: string;
    priority: number;
    expiresAt?: Date;
    createdAt: Date;
}
export declare class NotificationListResponseDto {
    data: NotificationResponseDto[];
    total: number;
    unreadCount: number;
}
