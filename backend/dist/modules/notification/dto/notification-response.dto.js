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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationListResponseDto = exports.NotificationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const notification_schema_1 = require("../../../schemas/notification.schema");
class NotificationResponseDto {
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: notification_schema_1.NotificationType, description: 'Notification type' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional data' }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target user ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "targetUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target organization ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "targetOrganizationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target role' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "targetRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether notification has been read' }),
    __metadata("design:type", Boolean)
], NotificationResponseDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Read timestamp' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "readAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Related emergency ID' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "emergencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority level' }),
    __metadata("design:type", Number)
], NotificationResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
class NotificationListResponseDto {
}
exports.NotificationListResponseDto = NotificationListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [NotificationResponseDto] }),
    __metadata("design:type", Array)
], NotificationListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unread count' }),
    __metadata("design:type", Number)
], NotificationListResponseDto.prototype, "unreadCount", void 0);
//# sourceMappingURL=notification-response.dto.js.map