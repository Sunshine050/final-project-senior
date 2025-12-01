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
exports.HospitalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hospital_service_1 = require("./hospital.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
let HospitalController = class HospitalController {
    constructor(hospitalService) {
        this.hospitalService = hospitalService;
    }
    async getAllHospitals() {
        return this.hospitalService.getAllHospitals();
    }
    async getNearbyHospitals(query) {
        return this.hospitalService.getNearbyHospitals(query);
    }
    async getHospitalById(id) {
        const hospital = await this.hospitalService.getHospitalById(id);
        if (!hospital) {
            throw new common_1.NotFoundException('Hospital not found');
        }
        return hospital;
    }
    async updateBedAvailability(id, updateDto) {
        return this.hospitalService.updateBedAvailability(id, updateDto);
    }
};
exports.HospitalController = HospitalController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all hospitals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of hospitals', type: dto_1.HospitalListResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "getAllHospitals", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Get nearby hospitals using geospatial query' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby hospitals sorted by distance', type: [dto_1.HospitalResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.NearbyQueryDto]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "getNearbyHospitals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hospital by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Hospital ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hospital details', type: dto_1.HospitalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hospital not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "getHospitalById", null);
__decorate([
    (0, common_1.Patch)(':id/beds'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN, enums_1.Role.HOSPITAL_STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update hospital bed availability' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Hospital ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bed availability updated', type: dto_1.HospitalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hospital not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBedAvailabilityDto]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "updateBedAvailability", null);
exports.HospitalController = HospitalController = __decorate([
    (0, swagger_1.ApiTags)('hospitals'),
    (0, common_1.Controller)('hospitals'),
    __metadata("design:paramtypes", [hospital_service_1.HospitalService])
], HospitalController);
//# sourceMappingURL=hospital.controller.js.map