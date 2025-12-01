import { Document, Types } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare enum NotificationType {
    EMERGENCY_NEW = "emergency_new",
    EMERGENCY_ASSIGNED = "emergency_assigned",
    EMERGENCY_STATUS_UPDATE = "emergency_status_update",
    HOSPITAL_BED_UPDATE = "hospital_bed_update",
    SYSTEM = "system",
    INFO = "info",
    WARNING = "warning",
    ALERT = "alert"
}
export declare class Notification {
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    targetUserId?: Types.ObjectId;
    targetOrganizationId?: Types.ObjectId;
    targetRole?: string;
    isRead: boolean;
    readAt?: Date;
    emergencyId?: Types.ObjectId;
    priority: number;
    expiresAt?: Date;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any, {}> & Notification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
