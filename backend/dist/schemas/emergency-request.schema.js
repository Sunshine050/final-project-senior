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
exports.EmergencyRequestSchema = exports.EmergencyRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../common/enums");
let EmergencyRequest = class EmergencyRequest {
};
exports.EmergencyRequest = EmergencyRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caller/requester user ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyRequest.prototype, "requesterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caller name (for anonymous requests)' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "callerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caller phone number' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "callerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency description' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.EmergencySeverity, description: 'Emergency severity level' }),
    (0, mongoose_1.Prop)({ required: true, enum: enums_1.EmergencySeverity, default: enums_1.EmergencySeverity.MEDIUM }),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.EmergencyStatus, description: 'Current status of emergency' }),
    (0, mongoose_1.Prop)({ required: true, enum: enums_1.EmergencyStatus, default: enums_1.EmergencyStatus.PENDING }),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency location address' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'GeoJSON location' }),
    (0, mongoose_1.Prop)({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    }),
    __metadata("design:type", Object)
], EmergencyRequest.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned hospital ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyRequest.prototype, "assignedHospitalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned rescue team ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyRequest.prototype, "assignedRescueTeamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dispatcher who handled the case' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyRequest.prototype, "dispatcherId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of patients/victims' }),
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], EmergencyRequest.prototype, "patientCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient information' }),
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], EmergencyRequest.prototype, "patients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency type/category' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "emergencyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmergencyRequest.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status history' }),
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], EmergencyRequest.prototype, "statusHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated arrival time' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmergencyRequest.prototype, "estimatedArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actual arrival time' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmergencyRequest.prototype, "actualArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Completion time' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmergencyRequest.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority score for sorting' }),
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EmergencyRequest.prototype, "priorityScore", void 0);
exports.EmergencyRequest = EmergencyRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EmergencyRequest);
exports.EmergencyRequestSchema = mongoose_1.SchemaFactory.createForClass(EmergencyRequest);
exports.EmergencyRequestSchema.index({ location: '2dsphere' });
exports.EmergencyRequestSchema.index({ status: 1 });
exports.EmergencyRequestSchema.index({ severity: 1 });
exports.EmergencyRequestSchema.index({ assignedHospitalId: 1 });
exports.EmergencyRequestSchema.index({ assignedRescueTeamId: 1 });
exports.EmergencyRequestSchema.index({ createdAt: -1 });
exports.EmergencyRequestSchema.index({ status: 1, severity: 1 });
//# sourceMappingURL=emergency-request.schema.js.map