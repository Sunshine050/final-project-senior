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
exports.EmergencyResponseSchema = exports.EmergencyResponse = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let EmergencyResponse = class EmergencyResponse {
};
exports.EmergencyResponse = EmergencyResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency request ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'EmergencyRequest', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyResponse.prototype, "emergencyRequestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Responding organization ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Organization', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyResponse.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Responder user ID' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EmergencyResponse.prototype, "responderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response type (rescue, hospital, etc.)' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmergencyResponse.prototype, "responseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dispatch time' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], EmergencyResponse.prototype, "dispatchTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Arrival time at scene' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmergencyResponse.prototype, "arrivalTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Departure time from scene' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmergencyResponse.prototype, "departureTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Arrival at hospital time' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EmergencyResponse.prototype, "hospitalArrivalTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vehicle/unit identifier' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmergencyResponse.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Team members involved' }),
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'User', default: [] }),
    __metadata("design:type", Array)
], EmergencyResponse.prototype, "teamMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actions taken at scene' }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], EmergencyResponse.prototype, "actionsTaken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medical procedures performed' }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], EmergencyResponse.prototype, "medicalProcedures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Equipment used' }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], EmergencyResponse.prototype, "equipmentUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient vitals recorded' }),
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], EmergencyResponse.prototype, "patientVitals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response notes' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmergencyResponse.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response outcome' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EmergencyResponse.prototype, "outcome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Distance traveled in km' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], EmergencyResponse.prototype, "distanceTraveled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response duration in minutes' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], EmergencyResponse.prototype, "responseDuration", void 0);
exports.EmergencyResponse = EmergencyResponse = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EmergencyResponse);
exports.EmergencyResponseSchema = mongoose_1.SchemaFactory.createForClass(EmergencyResponse);
exports.EmergencyResponseSchema.index({ emergencyRequestId: 1 });
exports.EmergencyResponseSchema.index({ organizationId: 1 });
exports.EmergencyResponseSchema.index({ dispatchTime: -1 });
//# sourceMappingURL=emergency-response.schema.js.map