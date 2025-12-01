"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../../schemas/notification.schema");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let NotificationService = class NotificationService {
    constructor(notificationModel, wsGateway) {
        this.notificationModel = notificationModel;
        this.wsGateway = wsGateway;
    }
    async create(createDto) {
        const notification = new this.notificationModel({
            ...createDto,
            targetUserId: createDto.targetUserId ? new mongoose_2.Types.ObjectId(createDto.targetUserId) : undefined,
            targetOrganizationId: createDto.targetOrganizationId
                ? new mongoose_2.Types.ObjectId(createDto.targetOrganizationId)
                : undefined,
            emergencyId: createDto.emergencyId ? new mongoose_2.Types.ObjectId(createDto.emergencyId) : undefined,
            expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
        });
        await notification.save();
        this.emitNotification(notification);
        return this.mapToResponseDto(notification);
    }
    async createEmergencyNotification(type, title, message, emergencyId, targetOrganizationId, targetRole) {
        return this.create({
            type,
            title,
            message,
            emergencyId,
            targetOrganizationId,
            targetRole,
            priority: type === notification_schema_1.NotificationType.EMERGENCY_NEW ? 5 : 4,
        });
    }
    async getUserNotifications(userId, organizationId, role, limit = 50) {
        const query = {
            $or: [
                { targetUserId: new mongoose_2.Types.ObjectId(userId) },
                ...(organizationId ? [{ targetOrganizationId: new mongoose_2.Types.ObjectId(organizationId) }] : []),
                ...(role ? [{ targetRole: role }] : []),
                { targetUserId: null, targetOrganizationId: null, targetRole: null },
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
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationModel
            .findOneAndUpdate({
            _id: new mongoose_2.Types.ObjectId(notificationId),
            $or: [
                { targetUserId: new mongoose_2.Types.ObjectId(userId) },
                { targetUserId: null },
            ],
        }, {
            isRead: true,
            readAt: new Date(),
        }, { new: true })
            .exec();
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return this.mapToResponseDto(notification);
    }
    async markAllAsRead(userId, organizationId, role) {
        const query = {
            isRead: false,
            $or: [
                { targetUserId: new mongoose_2.Types.ObjectId(userId) },
                ...(organizationId ? [{ targetOrganizationId: new mongoose_2.Types.ObjectId(organizationId) }] : []),
                ...(role ? [{ targetRole: role }] : []),
            ],
        };
        const result = await this.notificationModel
            .updateMany(query, { isRead: true, readAt: new Date() })
            .exec();
        return result.modifiedCount;
    }
    async deleteNotification(notificationId) {
        await this.notificationModel.findByIdAndDelete(notificationId).exec();
    }
    emitNotification(notification) {
        const payload = {
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
    mapToResponseDto(notification) {
        const doc = notification;
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
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        websocket_gateway_1.AppWebSocketGateway])
], NotificationService);
//# sourceMappingURL=notification.service.js.map