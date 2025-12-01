import { NotificationService } from './notification.service';
import { NotificationResponseDto, NotificationListResponseDto } from './dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(user: JwtPayload, limit?: number): Promise<NotificationListResponseDto>;
    markAsRead(id: string, user: JwtPayload): Promise<NotificationResponseDto>;
    markAllAsRead(user: JwtPayload): Promise<{
        markedCount: number;
    }>;
}
