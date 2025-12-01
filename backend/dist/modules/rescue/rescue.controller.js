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
exports.RescueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rescue_service_1 = require("./rescue.service");
const dto_1 = require("./dto");
let RescueController = class RescueController {
    constructor(rescueService) {
        this.rescueService = rescueService;
    }
    async getAllRescueTeams() {
        return this.rescueService.getAllRescueTeams();
    }
    async getAvailableRescueTeams() {
        return this.rescueService.getAvailableRescueTeams();
    }
    async getRescueTeamById(id) {
        const team = await this.rescueService.getRescueTeamById(id);
        if (!team) {
            throw new common_1.NotFoundException('Rescue team not found');
        }
        return team;
    }
};
exports.RescueController = RescueController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rescue teams' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of rescue teams', type: dto_1.RescueTeamListResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RescueController.prototype, "getAllRescueTeams", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available rescue teams' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available rescue teams', type: [dto_1.RescueTeamResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RescueController.prototype, "getAvailableRescueTeams", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rescue team by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Rescue team ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rescue team details', type: dto_1.RescueTeamResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rescue team not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RescueController.prototype, "getRescueTeamById", null);
exports.RescueController = RescueController = __decorate([
    (0, swagger_1.ApiTags)('rescue-teams'),
    (0, common_1.Controller)('rescue-teams'),
    __metadata("design:paramtypes", [rescue_service_1.RescueService])
], RescueController);
//# sourceMappingURL=rescue.controller.js.map