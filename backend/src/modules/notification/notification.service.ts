import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from '../../schemas/notification.schema';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { CreateNotificationDto, NotificationResponseDto, NotificationListResponseDto } from './dto';
import { NotificationPayload } from '../../common/interfaces/socket.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly wsGateway: AppWebSocketGateway,
  ) {}

  async create(createDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = new this.notificationModel({
      ...createDto,
      targetUserId: createDto.targetUserId ? new Types.ObjectId(createDto.targetUserId) : undefined,
      targetOrganizationId: createDto.targetOrganizationId
        ? new Types.ObjectId(createDto.targetOrganizationId)
        : undefined,
      emergencyId: createDto.emergencyId ? new Types.ObjectId(createDto.emergencyId) : undefined,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
    });

    await notification.save();

    // Emit via WebSocket
    this.emitNotification(notification);

    return this.mapToResponseDto(notification);
  }

  async createEmergencyNotification(
    type: NotificationType,
    title: string,
    message: string,
    emergencyId: string,
    targetOrganizationId?: string,
    targetRole?: string,
  ): Promise<NotificationResponseDto> {
    return this.create({
      type,
      title,
      message,
      emergencyId,
      targetOrganizationId,
      targetRole,
      priority: type === NotificationType.EMERGENCY_NEW ? 5 : 4,
    });
  }

  async getUserNotifications(
    userId: string,
    organizationId?: string,
    role?: string,
    limit = 50,
  ): Promise<NotificationListResponseDto> {
    const query: Record<string, unknown> = {
      $or: [
        { targetUserId: new Types.ObjectId(userId) },
        ...(organizationId ? [{ targetOrganizationId: new Types.ObjectId(organizationId) }] : []),
        ...(role ? [{ targetRole: role }] : []),
        { targetUserId: null, targetOrganizationId: null, targetRole: null }, // Broadcast notifications
      ],
    };

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query).exec(),
      this.notificationModel.countDocuments({ ...query, isRead: false }).exec(),
    ]);

    return {
      data: notifications.map((n) => this.mapToResponseDto(n)),
      total,
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponseDto> {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(notificationId),
          $or: [
            { targetUserId: new Types.ObjectId(userId) },
            { targetUserId: null },
          ],
        },
        {
          isRead: true,
          readAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.mapToResponseDto(notification);
  }

  async markAllAsRead(userId: string, organizationId?: string, role?: string): Promise<number> {
    const query: Record<string, unknown> = {
      isRead: false,
      $or: [
        { targetUserId: new Types.ObjectId(userId) },
        ...(organizationId ? [{ targetOrganizationId: new Types.ObjectId(organizationId) }] : []),
        ...(role ? [{ targetRole: role }] : []),
      ],
    };

    const result = await this.notificationModel
      .updateMany(query, { isRead: true, readAt: new Date() })
      .exec();

    return result.modifiedCount;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(notificationId).exec();
  }

  private emitNotification(notification: NotificationDocument): void {
    const payload: NotificationPayload = {
      id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      targetUserId: notification.targetUserId?.toString(),
      targetOrganizationId: notification.targetOrganizationId?.toString(),
      targetRole: notification.targetRole,
      timestamp: new Date(),
    };

    this.wsGateway.emitNotification(payload);
  }

  private mapToResponseDto(notification: NotificationDocument): NotificationResponseDto {
    const doc = notification as NotificationDocument & { createdAt: Date };
    return {
      id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      targetUserId: notification.targetUserId?.toString(),
      targetOrganizationId: notification.targetOrganizationId?.toString(),
      targetRole: notification.targetRole,
      isRead: notification.isRead,
      readAt: notification.readAt,
      emergencyId: notification.emergencyId?.toString(),
      priority: notification.priority,
      expiresAt: notification.expiresAt,
      createdAt: doc.createdAt,
    };
  }
}

