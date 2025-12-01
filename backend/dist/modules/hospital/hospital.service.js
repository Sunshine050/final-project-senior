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
exports.HospitalService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("../../schemas/organization.schema");
const enums_1 = require("../../common/enums");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let HospitalService = class HospitalService {
    constructor(organizationModel, wsGateway) {
        this.organizationModel = organizationModel;
        this.wsGateway = wsGateway;
    }
    async getAllHospitals() {
        const hospitals = await this.organizationModel
            .find({
            type: enums_1.OrganizationType.HOSPITAL,
            isActive: true,
        })
            .sort({ name: 1 })
            .exec();
        return {
            data: hospitals.map((h) => this.mapToResponseDto(h)),
            total: hospitals.length,
        };
    }
    async getNearbyHospitals(query) {
        const { longitude, latitude, maxDistance, limit } = query;
        const hospitals = await this.organizationModel.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistance || 10000,
                    spherical: true,
                    query: {
                        type: enums_1.OrganizationType.HOSPITAL,
                        isActive: true,
                    },
                },
            },
            {
                $limit: limit || 10,
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    type: 1,
                    address: 1,
                    phone: 1,
                    email: 1,
                    location: 1,
                    isActive: 1,
                    capacity: 1,
                    availableCapacity: 1,
                    operatingHours: 1,
                    services: 1,
                    distance: { $round: ['$distance', 0] },
                },
            },
        ]);
        return hospitals.map((h) => this.mapAggregateToResponseDto(h));
    }
    async getHospitalById(id) {
        const hospital = await this.organizationModel.findById(id).exec();
        if (!hospital || hospital.type !== enums_1.OrganizationType.HOSPITAL) {
            return null;
        }
        return this.mapToResponseDto(hospital);
    }
    async updateBedAvailability(hospitalId, updateDto) {
        const hospital = await this.organizationModel.findOneAndUpdate({
            _id: hospitalId,
            type: enums_1.OrganizationType.HOSPITAL,
        }, {
            availableCapacity: updateDto.availableBeds,
        }, { new: true }).exec();
        if (!hospital) {
            throw new common_1.NotFoundException('Hospital not found');
        }
        this.emitBedUpdate(hospital);
        return this.mapToResponseDto(hospital);
    }
    emitBedUpdate(hospital) {
        const payload = {
            hospitalId: hospital._id.toString(),
            hospitalName: hospital.name,
            totalBeds: hospital.capacity,
            availableBeds: hospital.availableCapacity,
            timestamp: new Date(),
        };
        this.wsGateway.emitHospitalBedUpdate(payload);
    }
    mapToResponseDto(hospital) {
        return {
            id: hospital._id.toString(),
            name: hospital.name,
            type: hospital.type,
            address: hospital.address,
            phone: hospital.phone,
            email: hospital.email,
            location: {
                type: hospital.location.type,
                coordinates: hospital.location.coordinates,
            },
            isActive: hospital.isActive,
            capacity: hospital.capacity,
            availableCapacity: hospital.availableCapacity,
            operatingHours: hospital.operatingHours,
            services: hospital.services,
        };
    }
    mapAggregateToResponseDto(hospital) {
        return {
            id: String(hospital._id),
            name: hospital.name,
            type: hospital.type,
            address: hospital.address,
            phone: hospital.phone,
            email: hospital.email,
            location: {
                type: hospital.location.type,
                coordinates: hospital.location.coordinates,
            },
            isActive: hospital.isActive,
            capacity: hospital.capacity,
            availableCapacity: hospital.availableCapacity,
            operatingHours: hospital.operatingHours,
            services: hospital.services,
            distance: hospital.distance,
        };
    }
};
exports.HospitalService = HospitalService;
exports.HospitalService = HospitalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        websocket_gateway_1.AppWebSocketGateway])
], HospitalService);
//# sourceMappingURL=hospital.service.js.map