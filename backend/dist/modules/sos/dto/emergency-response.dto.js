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
exports.EmergencyListResponseDto = exports.EmergencyResponseDto = exports.EmergencyLocationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class EmergencyLocationDto {
}
exports.EmergencyLocationDto = EmergencyLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location type', example: 'Point' }),
    __metadata("design:type", String)
], EmergencyLocationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] }),
    __metadata("design:type", Array)
], EmergencyLocationDto.prototype, "coordinates", void 0);
class EmergencyResponseDto {
}
exports.EmergencyResponseDto = EmergencyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency ID' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caller name' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "callerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caller phone' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "callerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency description' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.EmergencySeverity, description: 'Severity level' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.EmergencyStatus, description: 'Current status' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergency address' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EmergencyLocationDto, description: 'GeoJSON location' }),
    __metadata("design:type", EmergencyLocationDto)
], EmergencyResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned hospital ID' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "assignedHospitalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned rescue team ID' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "assignedRescueTeamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dispatcher ID' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "dispatcherId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of patients' }),
    __metadata("design:type", Number)
], EmergencyResponseDto.prototype, "patientCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Emergency type' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "emergencyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    __metadata("design:type", String)
], EmergencyResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated arrival time' }),
    __metadata("design:type", Date)
], EmergencyResponseDto.prototype, "estimatedArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], EmergencyResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp' }),
    __metadata("design:type", Date)
], EmergencyResponseDto.prototype, "updatedAt", void 0);
class EmergencyListResponseDto {
}
exports.EmergencyListResponseDto = EmergencyListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EmergencyResponseDto], description: 'List of emergencies' }),
    __metadata("design:type", Array)
], EmergencyListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], EmergencyListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], EmergencyListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], EmergencyListResponseDto.prototype, "limit", void 0);
//# sourceMappingURL=emergency-response.dto.js.map