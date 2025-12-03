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
exports.QueryEmergencyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
class QueryEmergencyDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.QueryEmergencyDto = QueryEmergencyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.EmergencyStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    (0, class_validator_1.IsEnum)(enums_1.EmergencyStatus),
    __metadata("design:type", String)
], QueryEmergencyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.EmergencySeverity, description: 'Filter by severity' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    (0, class_validator_1.IsEnum)(enums_1.EmergencySeverity),
    __metadata("design:type", String)
], QueryEmergencyDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by assigned hospital' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], QueryEmergencyDto.prototype, "hospitalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by assigned rescue team' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], QueryEmergencyDto.prototype, "rescueTeamId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryEmergencyDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryEmergencyDto.prototype, "limit", void 0);
//# sourceMappingURL=query-emergency.dto.js.map