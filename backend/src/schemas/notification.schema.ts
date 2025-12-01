import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  EMERGENCY_NEW = 'emergency_new',
  EMERGENCY_ASSIGNED = 'emergency_assigned',
  EMERGENCY_STATUS_UPDATE = 'emergency_status_update',
  HOSPITAL_BED_UPDATE = 'hospital_bed_update',
  SYSTEM = 'system',
  INFO = 'info',
  WARNING = 'warning',
  ALERT = 'alert',
}

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ description: 'Notification title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @Prop({ required: true })
  message: string;

  @ApiProperty({ description: 'Additional data' })
  @Prop({ type: Object })
  data?: Record<string, unknown>;

  @ApiProperty({ description: 'Target user ID (for user-specific notifications)' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  targetUserId?: Types.ObjectId;

  @ApiProperty({ description: 'Target organization ID' })
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  targetOrganizationId?: Types.ObjectId;

  @ApiProperty({ description: 'Target role (for role-based notifications)' })
  @Prop()
  targetRole?: string;

  @ApiProperty({ description: 'Whether notification has been read' })
  @Prop({ default: false })
  isRead: boolean;

  @ApiProperty({ description: 'Read timestamp' })
  @Prop()
  readAt?: Date;

  @ApiProperty({ description: 'Related emergency ID' })
  @Prop({ type: Types.ObjectId, ref: 'EmergencyRequest' })
  emergencyId?: Types.ObjectId;

  @ApiProperty({ description: 'Priority level (1-5, 5 being highest)' })
  @Prop({ default: 3 })
  priority: number;

  @ApiProperty({ description: 'Expiration date' })
  @Prop()
  expiresAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes
NotificationSchema.index({ targetUserId: 1, isRead: 1 });
NotificationSchema.index({ targetOrganizationId: 1 });
NotificationSchema.index({ targetRole: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ type: 1 });

