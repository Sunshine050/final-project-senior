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
exports.OrganizationResponseDto = exports.OrganizationOperatingHoursDto = exports.OrganizationLocationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class OrganizationLocationDto {
}
exports.OrganizationLocationDto = OrganizationLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location type', example: 'Point' }),
    __metadata("design:type", String)
], OrganizationLocationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] }),
    __metadata("design:type", Array)
], OrganizationLocationDto.prototype, "coordinates", void 0);
class OrganizationOperatingHoursDto {
}
exports.OrganizationOperatingHoursDto = OrganizationOperatingHoursDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Opening time', example: '08:00' }),
    __metadata("design:type", String)
], OrganizationOperatingHoursDto.prototype, "open", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Closing time', example: '20:00' }),
    __metadata("design:type", String)
], OrganizationOperatingHoursDto.prototype, "close", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether open 24 hours' }),
    __metadata("design:type", Boolean)
], OrganizationOperatingHoursDto.prototype, "is24Hours", void 0);
class OrganizationResponseDto {
}
exports.OrganizationResponseDto = OrganizationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization ID' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.OrganizationType, description: 'Organization type' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization address' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact phone' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email' }),
    __metadata("design:type", String)
], OrganizationResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: OrganizationLocationDto, description: 'GeoJSON location' }),
    __metadata("design:type", OrganizationLocationDto)
], OrganizationResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether organization is active' }),
    __metadata("design:type", Boolean)
], OrganizationResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total capacity' }),
    __metadata("design:type", Number)
], OrganizationResponseDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available capacity' }),
    __metadata("design:type", Number)
], OrganizationResponseDto.prototype, "availableCapacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: OrganizationOperatingHoursDto, description: 'Operating hours' }),
    __metadata("design:type", OrganizationOperatingHoursDto)
], OrganizationResponseDto.prototype, "operatingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Services provided' }),
    __metadata("design:type", Array)
], OrganizationResponseDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], OrganizationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp' }),
    __metadata("design:type", Date)
], OrganizationResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=organization-response.dto.js.map