import { NotificationType } from '../../../schemas/notification.schema';
export declare class CreateNotificationDto {
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    targetUserId?: string;
    targetOrganizationId?: string;
    targetRole?: string;
    emergencyId?: string;
    priority?: number;
    expiresAt?: string;
}
