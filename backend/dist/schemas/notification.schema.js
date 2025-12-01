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
exports.NotificationSchema = exports.Notification = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
var NotificationType;
(function (NotificationType) {
    NotificationType["EMERGENCY_NEW"] = "emergency_new";
    NotificationType["EMERGENCY_ASSIGNED"] = "emergency_assigned";
    NotificationType["EMERGENCY_STATUS_UPDATE"] = "emergency_status_update";
    NotificationType["HOSPITAL_BED_UPDATE"] = "hospital_bed_update";
    NotificationType["SYSTEM"] = "system";
    NotificationType["INFO"] = "info";
    NotificationType["WARNING"] = "warning";
    NotificationType["ALERT"] = "alert";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: NotificationType, description: 'Notification type' }),
    (0, mongoose_1.Prop)({ required: true, enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional data' }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target user ID (for user-specific notifications)' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Notification.prototype, "targetUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target organization ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Notification.prototype, "targetOrganizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target role (for role-based notifications)' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "targetRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether notification has been read' }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Read timestamp' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Notification.prototype, "readAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Related emergency ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'EmergencyRequest' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Notification.prototype, "emergencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority level (1-5, 5 being highest)' }),
    (0, mongoose_1.Prop)({ default: 3 }),
    __metadata("design:type", Number)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expiration date' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Notification.prototype, "expiresAt", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ targetUserId: 1, isRead: 1 });
exports.NotificationSchema.index({ targetOrganizationId: 1 });
exports.NotificationSchema.index({ targetRole: 1 });
exports.NotificationSchema.index({ createdAt: -1 });
exports.NotificationSchema.index({ type: 1 });
//# sourceMappingURL=notification.schema.js.map