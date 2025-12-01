import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../../../schemas/notification.schema';

export class NotificationResponseDto {
  @ApiProperty({ description: 'Notification ID' })
  id: string;

  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  type: NotificationType;

  @ApiProperty({ description: 'Notification title' })
  title: string;

  @ApiProperty({ description: 'Notification message' })
  message: string;

  @ApiPropertyOptional({ description: 'Additional data' })
  data?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Target user ID' })
  targetUserId?: string;

  @ApiPropertyOptional({ description: 'Target organization ID' })
  targetOrganizationId?: string;

  @ApiPropertyOptional({ description: 'Target role' })
  targetRole?: string;

  @ApiProperty({ description: 'Whether notification has been read' })
  isRead: boolean;

  @ApiPropertyOptional({ description: 'Read timestamp' })
  readAt?: Date;

  @ApiPropertyOptional({ description: 'Related emergency ID' })
  emergencyId?: string;

  @ApiProperty({ description: 'Priority level' })
  priority: number;

  @ApiPropertyOptional({ description: 'Expiration date' })
  expiresAt?: Date;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;
}

export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  data: NotificationResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Unread count' })
  unreadCount: number;
}

