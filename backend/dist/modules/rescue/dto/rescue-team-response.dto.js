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
exports.RescueTeamListResponseDto = exports.RescueTeamResponseDto = exports.RescueLocationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RescueLocationDto {
}
exports.RescueLocationDto = RescueLocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location type', example: 'Point' }),
    __metadata("design:type", String)
], RescueLocationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] }),
    __metadata("design:type", Array)
], RescueLocationDto.prototype, "coordinates", void 0);
class RescueTeamResponseDto {
}
exports.RescueTeamResponseDto = RescueTeamResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rescue team ID' }),
    __metadata("design:type", String)
], RescueTeamResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rescue team name' }),
    __metadata("design:type", String)
], RescueTeamResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization type' }),
    __metadata("design:type", String)
], RescueTeamResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base address' }),
    __metadata("design:type", String)
], RescueTeamResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact phone' }),
    __metadata("design:type", String)
], RescueTeamResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email' }),
    __metadata("design:type", String)
], RescueTeamResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RescueLocationDto, description: 'GeoJSON location' }),
    __metadata("design:type", RescueLocationDto)
], RescueTeamResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether team is active' }),
    __metadata("design:type", Boolean)
], RescueTeamResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total vehicle/unit capacity' }),
    __metadata("design:type", Number)
], RescueTeamResponseDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available units' }),
    __metadata("design:type", Number)
], RescueTeamResponseDto.prototype, "availableCapacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Services provided' }),
    __metadata("design:type", Array)
], RescueTeamResponseDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Distance in meters (for nearby queries)' }),
    __metadata("design:type", Number)
], RescueTeamResponseDto.prototype, "distance", void 0);
class RescueTeamListResponseDto {
}
exports.RescueTeamListResponseDto = RescueTeamListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RescueTeamResponseDto], description: 'List of rescue teams' }),
    __metadata("design:type", Array)
], RescueTeamListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count' }),
    __metadata("design:type", Number)
], RescueTeamListResponseDto.prototype, "total", void 0);
//# sourceMappingURL=rescue-team-response.dto.js.map