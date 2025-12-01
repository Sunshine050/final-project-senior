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
exports.RescueService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("../../schemas/organization.schema");
const enums_1 = require("../../common/enums");
let RescueService = class RescueService {
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }
    async getAllRescueTeams() {
        const teams = await this.organizationModel
            .find({
            type: enums_1.OrganizationType.RESCUE_TEAM,
            isActive: true,
        })
            .sort({ name: 1 })
            .exec();
        return {
            data: teams.map((t) => this.mapToResponseDto(t)),
            total: teams.length,
        };
    }
    async getAvailableRescueTeams() {
        const teams = await this.organizationModel
            .find({
            type: enums_1.OrganizationType.RESCUE_TEAM,
            isActive: true,
            availableCapacity: { $gt: 0 },
        })
            .sort({ availableCapacity: -1, name: 1 })
            .exec();
        return teams.map((t) => this.mapToResponseDto(t));
    }
    async getRescueTeamById(id) {
        const team = await this.organizationModel.findById(id).exec();
        if (!team || team.type !== enums_1.OrganizationType.RESCUE_TEAM) {
            return null;
        }
        return this.mapToResponseDto(team);
    }
    async updateAvailability(id, availableCapacity) {
        const team = await this.organizationModel
            .findByIdAndUpdate(id, { availableCapacity }, { new: true })
            .exec();
        if (!team) {
            return null;
        }
        return this.mapToResponseDto(team);
    }
    mapToResponseDto(team) {
        return {
            id: team._id.toString(),
            name: team.name,
            type: team.type,
            address: team.address,
            phone: team.phone,
            email: team.email,
            location: {
                type: team.location.type,
                coordinates: team.location.coordinates,
            },
            isActive: team.isActive,
            capacity: team.capacity,
            availableCapacity: team.availableCapacity,
            services: team.services,
        };
    }
};
exports.RescueService = RescueService;
exports.RescueService = RescueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RescueService);
//# sourceMappingURL=rescue.service.js.map