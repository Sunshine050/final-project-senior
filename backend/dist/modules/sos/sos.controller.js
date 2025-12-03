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
exports.SosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sos_service_1 = require("./sos.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
let SosController = class SosController {
    constructor(sosService) {
        this.sosService = sosService;
    }
    async createEmergency(createDto) {
        return this.sosService.createEmergency(createDto);
    }
    async assignEmergency(id, assignDto, user) {
        return this.sosService.assignEmergency(id, assignDto, user.sub);
    }
    async updateStatus(id, updateDto, user) {
        return this.sosService.updateStatus(id, updateDto, user.sub);
    }
    async getAllEmergencies(query) {
        return this.sosService.getAllEmergencies(query);
    }
    async getActiveEmergencies(user) {
        const organizationId = user.organizationId;
        return this.sosService.getActiveEmergencies(organizationId);
    }
    async getAssignedCases(user) {
        const organizationId = user.organizationId;
        const includeAllForAdmin = user.role === enums_1.Role.ADMIN && !organizationId;
        return this.sosService.getAssignedCases(organizationId, includeAllForAdmin);
    }
    async getEmergencyById(id) {
        return this.sosService.getEmergencyById(id);
    }
};
exports.SosController = SosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new emergency request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Emergency created', type: dto_1.EmergencyResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEmergencyDto]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "createEmergency", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN, enums_1.Role.DISPATCHER, enums_1.Role.HOSPITAL_STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Assign emergency to hospital/rescue team' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergency assigned', type: dto_1.EmergencyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AssignEmergencyDto, Object]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "assignEmergency", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN, enums_1.Role.DISPATCHER, enums_1.Role.HOSPITAL_STAFF, enums_1.Role.RESCUE_TEAM),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update emergency status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated', type: dto_1.EmergencyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateStatusDto, Object]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN, enums_1.Role.DISPATCHER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all emergencies with filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of emergencies', type: dto_1.EmergencyListResponseDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryEmergencyDto]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "getAllEmergencies", null);
__decorate([
    (0, common_1.Get)('dashboard/active-emergencies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN, enums_1.Role.DISPATCHER, enums_1.Role.HOSPITAL_STAFF),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active emergencies for hospital dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active emergencies', type: [dto_1.EmergencyResponseDto] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "getActiveEmergencies", null);
__decorate([
    (0, common_1.Get)('rescue/assigned-cases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN, enums_1.Role.RESCUE_TEAM),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get assigned cases for rescue team' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assigned cases', type: [dto_1.EmergencyResponseDto] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "getAssignedCases", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get emergency by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergency details', type: dto_1.EmergencyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "getEmergencyById", null);
exports.SosController = SosController = __decorate([
    (0, swagger_1.ApiTags)('sos'),
    (0, common_1.Controller)('sos'),
    __metadata("design:paramtypes", [sos_service_1.SosService])
], SosController);
//# sourceMappingURL=sos.controller.js.map