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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("../../schemas/organization.schema");
let OrganizationService = class OrganizationService {
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }
    async create(createDto) {
        const existing = await this.organizationModel.findOne({ name: createDto.name }).exec();
        if (existing) {
            throw new common_1.ConflictException('Organization with this name already exists');
        }
        const organization = new this.organizationModel({
            ...createDto,
            location: {
                type: 'Point',
                coordinates: [createDto.location.longitude, createDto.location.latitude],
            },
        });
        await organization.save();
        return this.mapToResponseDto(organization);
    }
    async findAll() {
        const organizations = await this.organizationModel.find().sort({ name: 1 }).exec();
        return organizations.map((o) => this.mapToResponseDto(o));
    }
    async findById(id) {
        const organization = await this.organizationModel.findById(id).exec();
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return this.mapToResponseDto(organization);
    }
    async update(id, updateDto) {
        const { location, ...rest } = updateDto;
        const updateData = { ...rest };
        if (location) {
            updateData.location = {
                type: 'Point',
                coordinates: [location.longitude, location.latitude],
            };
        }
        const organization = await this.organizationModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return this.mapToResponseDto(organization);
    }
    async delete(id) {
        const result = await this.organizationModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Organization not found');
        }
    }
    mapToResponseDto(org) {
        const doc = org;
        return {
            id: org._id.toString(),
            name: org.name,
            type: org.type,
            address: org.address,
            phone: org.phone,
            email: org.email,
            location: {
                type: org.location.type,
                coordinates: org.location.coordinates,
            },
            isActive: org.isActive,
            capacity: org.capacity,
            availableCapacity: org.availableCapacity,
            operatingHours: org.operatingHours,
            services: org.services,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map