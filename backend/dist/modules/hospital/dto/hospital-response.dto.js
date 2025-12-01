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
exports.HospitalListResponseDto = exports.HospitalResponseDto = exports.OperatingHoursDto = exports.HospitalLocationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class HospitalLocationDto {
}
exports.HospitalLocationDto = HospitalLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location type', example: 'Point' }),
    __metadata("design:type", String)
], HospitalLocationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] }),
    __metadata("design:type", Array)
], HospitalLocationDto.prototype, "coordinates", void 0);
class OperatingHoursDto {
}
exports.OperatingHoursDto = OperatingHoursDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Opening time', example: '08:00' }),
    __metadata("design:type", String)
], OperatingHoursDto.prototype, "open", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Closing time', example: '20:00' }),
    __metadata("design:type", String)
], OperatingHoursDto.prototype, "close", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether open 24 hours' }),
    __metadata("design:type", Boolean)
], OperatingHoursDto.prototype, "is24Hours", void 0);
class HospitalResponseDto {
}
exports.HospitalResponseDto = HospitalResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hospital ID' }),
    __metadata("design:type", String)
], HospitalResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hospital name' }),
    __metadata("design:type", String)
], HospitalResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hospital type' }),
    __metadata("design:type", String)
], HospitalResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hospital address' }),
    __metadata("design:type", String)
], HospitalResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact phone' }),
    __metadata("design:type", String)
], HospitalResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email' }),
    __metadata("design:type", String)
], HospitalResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: HospitalLocationDto, description: 'GeoJSON location' }),
    __metadata("design:type", HospitalLocationDto)
], HospitalResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether hospital is active' }),
    __metadata("design:type", Boolean)
], HospitalResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total bed capacity' }),
    __metadata("design:type", Number)
], HospitalResponseDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available beds' }),
    __metadata("design:type", Number)
], HospitalResponseDto.prototype, "availableCapacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: OperatingHoursDto, description: 'Operating hours' }),
    __metadata("design:type", OperatingHoursDto)
], HospitalResponseDto.prototype, "operatingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Services provided' }),
    __metadata("design:type", Array)
], HospitalResponseDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Distance in meters (for nearby queries)' }),
    __metadata("design:type", Number)
], HospitalResponseDto.prototype, "distance", void 0);
class HospitalListResponseDto {
}
exports.HospitalListResponseDto = HospitalListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [HospitalResponseDto], description: 'List of hospitals' }),
    __metadata("design:type", Array)
], HospitalListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], HospitalListResponseDto.prototype, "total", void 0);
//# sourceMappingURL=hospital-response.dto.js.map