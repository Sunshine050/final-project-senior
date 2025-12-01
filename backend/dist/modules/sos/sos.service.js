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
exports.SosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const emergency_request_schema_1 = require("../../schemas/emergency-request.schema");
const emergency_response_schema_1 = require("../../schemas/emergency-response.schema");
const enums_1 = require("../../common/enums");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let SosService = class SosService {
    constructor(emergencyRequestModel, emergencyResponseModel, wsGateway) {
        this.emergencyRequestModel = emergencyRequestModel;
        this.emergencyResponseModel = emergencyResponseModel;
        this.wsGateway = wsGateway;
    }
    async createEmergency(createDto, requesterId) {
        const emergency = new this.emergencyRequestModel({
            ...createDto,
            requesterId: requesterId ? new mongoose_2.Types.ObjectId(requesterId) : undefined,
            location: {
                type: 'Point',
                coordinates: [createDto.location.longitude, createDto.location.latitude],
            },
            status: enums_1.EmergencyStatus.PENDING,
            statusHistory: [
                {
                    status: enums_1.EmergencyStatus.PENDING,
                    timestamp: new Date(),
                    notes: 'Emergency request created',
                },
            ],
            priorityScore: this.calculatePriorityScore(createDto.severity),
        });
        await emergency.save();
        const responseDto = this.mapToResponseDto(emergency);
        this.emitNewEmergency(emergency);
        return responseDto;
    }
    async assignEmergency(id, assignDto, dispatcherId) {
        const emergency = await this.findEmergencyById(id);
        if (!assignDto.hospitalId && !assignDto.rescueTeamId) {
            throw new common_1.BadRequestException('Either hospitalId or rescueTeamId must be provided');
        }
        if (assignDto.hospitalId) {
            emergency.assignedHospitalId = new mongoose_2.Types.ObjectId(assignDto.hospitalId);
        }
        if (assignDto.rescueTeamId) {
            emergency.assignedRescueTeamId = new mongoose_2.Types.ObjectId(assignDto.rescueTeamId);
        }
        if (dispatcherId) {
            emergency.dispatcherId = new mongoose_2.Types.ObjectId(dispatcherId);
        }
        if (emergency.status === enums_1.EmergencyStatus.PENDING) {
            emergency.status = enums_1.EmergencyStatus.ASSIGNED;
            emergency.statusHistory.push({
                status: enums_1.EmergencyStatus.ASSIGNED,
                timestamp: new Date(),
                updatedBy: dispatcherId ? new mongoose_2.Types.ObjectId(dispatcherId) : undefined,
                notes: assignDto.notes || 'Emergency assigned',
            });
        }
        await emergency.save();
        if (assignDto.rescueTeamId) {
            await this.emergencyResponseModel.create({
                emergencyRequestId: emergency._id,
                organizationId: new mongoose_2.Types.ObjectId(assignDto.rescueTeamId),
                responderId: dispatcherId ? new mongoose_2.Types.ObjectId(dispatcherId) : undefined,
                responseType: 'rescue',
                dispatchTime: new Date(),
            });
        }
        const responseDto = this.mapToResponseDto(emergency);
        this.emitEmergencyAssigned(emergency);
        return responseDto;
    }
    async updateStatus(id, updateDto, userId) {
        const emergency = await this.findEmergencyById(id);
        this.validateStatusTransition(emergency.status, updateDto.status);
        emergency.status = updateDto.status;
        emergency.statusHistory.push({
            status: updateDto.status,
            timestamp: new Date(),
            updatedBy: userId ? new mongoose_2.Types.ObjectId(userId) : undefined,
            notes: updateDto.notes,
        });
        if (updateDto.estimatedArrival) {
            emergency.estimatedArrival = new Date(updateDto.estimatedArrival);
        }
        if (updateDto.status === enums_1.EmergencyStatus.ON_SCENE) {
            emergency.actualArrival = new Date();
        }
        if (updateDto.status === enums_1.EmergencyStatus.COMPLETED) {
            emergency.completedAt = new Date();
        }
        await emergency.save();
        const responseDto = this.mapToResponseDto(emergency);
        this.emitStatusUpdate(emergency);
        return responseDto;
    }
    async getAllEmergencies(query) {
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.severity) {
            filter.severity = query.severity;
        }
        if (query.hospitalId) {
            filter.assignedHospitalId = new mongoose_2.Types.ObjectId(query.hospitalId);
        }
        if (query.rescueTeamId) {
            filter.assignedRescueTeamId = new mongoose_2.Types.ObjectId(query.rescueTeamId);
        }
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const [emergencies, total] = await Promise.all([
            this.emergencyRequestModel
                .find(filter)
                .sort({ priorityScore: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.emergencyRequestModel.countDocuments(filter).exec(),
        ]);
        return {
            data: emergencies.map((e) => this.mapToResponseDto(e)),
            total,
            page,
            limit,
        };
    }
    async getActiveEmergencies(hospitalId) {
        const activeStatuses = [
            enums_1.EmergencyStatus.PENDING,
            enums_1.EmergencyStatus.ASSIGNED,
            enums_1.EmergencyStatus.EN_ROUTE,
            enums_1.EmergencyStatus.ON_SCENE,
            enums_1.EmergencyStatus.TRANSPORTING,
        ];
        const emergencies = await this.emergencyRequestModel
            .find({
            status: { $in: activeStatuses },
            $or: [
                { assignedHospitalId: new mongoose_2.Types.ObjectId(hospitalId) },
                { assignedHospitalId: { $exists: false } },
            ],
        })
            .sort({ priorityScore: -1, createdAt: -1 })
            .exec();
        return emergencies.map((e) => this.mapToResponseDto(e));
    }
    async getAssignedCases(rescueTeamId) {
        const activeStatuses = [
            enums_1.EmergencyStatus.ASSIGNED,
            enums_1.EmergencyStatus.EN_ROUTE,
            enums_1.EmergencyStatus.ON_SCENE,
            enums_1.EmergencyStatus.TRANSPORTING,
        ];
        const emergencies = await this.emergencyRequestModel
            .find({
            assignedRescueTeamId: new mongoose_2.Types.ObjectId(rescueTeamId),
            status: { $in: activeStatuses },
        })
            .sort({ priorityScore: -1, createdAt: -1 })
            .exec();
        return emergencies.map((e) => this.mapToResponseDto(e));
    }
    async getEmergencyById(id) {
        const emergency = await this.findEmergencyById(id);
        return this.mapToResponseDto(emergency);
    }
    emitNewEmergency(emergency) {
        const payload = this.createEventPayload(emergency);
        this.wsGateway.emitNewEmergency(payload);
    }
    emitEmergencyAssigned(emergency) {
        const payload = this.createEventPayload(emergency);
        this.wsGateway.emitEmergencyAssigned(payload);
    }
    emitStatusUpdate(emergency) {
        const payload = this.createEventPayload(emergency);
        this.wsGateway.emitEmergencyStatusUpdate(payload);
    }
    createEventPayload(emergency) {
        return {
            emergencyId: emergency._id.toString(),
            status: emergency.status,
            severity: emergency.severity,
            assignedHospitalId: emergency.assignedHospitalId?.toString(),
            assignedRescueTeamId: emergency.assignedRescueTeamId?.toString(),
            location: {
                type: emergency.location.type,
                coordinates: emergency.location.coordinates,
            },
            callerName: emergency.callerName,
            description: emergency.description,
            timestamp: new Date(),
        };
    }
    async findEmergencyById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid emergency ID');
        }
        const emergency = await this.emergencyRequestModel.findById(id).exec();
        if (!emergency) {
            throw new common_1.NotFoundException('Emergency not found');
        }
        return emergency;
    }
    calculatePriorityScore(severity) {
        const severityScores = {
            critical: 100,
            high: 75,
            medium: 50,
            low: 25,
        };
        return severityScores[severity] || 50;
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [enums_1.EmergencyStatus.PENDING]: [enums_1.EmergencyStatus.ASSIGNED, enums_1.EmergencyStatus.CANCELLED],
            [enums_1.EmergencyStatus.ASSIGNED]: [enums_1.EmergencyStatus.EN_ROUTE, enums_1.EmergencyStatus.CANCELLED],
            [enums_1.EmergencyStatus.EN_ROUTE]: [enums_1.EmergencyStatus.ON_SCENE, enums_1.EmergencyStatus.CANCELLED],
            [enums_1.EmergencyStatus.ON_SCENE]: [enums_1.EmergencyStatus.TRANSPORTING, enums_1.EmergencyStatus.COMPLETED, enums_1.EmergencyStatus.CANCELLED],
            [enums_1.EmergencyStatus.TRANSPORTING]: [enums_1.EmergencyStatus.COMPLETED, enums_1.EmergencyStatus.CANCELLED],
            [enums_1.EmergencyStatus.COMPLETED]: [],
            [enums_1.EmergencyStatus.CANCELLED]: [],
        };
        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from '${currentStatus}' to '${newStatus}'`);
        }
    }
    mapToResponseDto(emergency) {
        const doc = emergency;
        return {
            id: emergency._id.toString(),
            callerName: emergency.callerName,
            callerPhone: emergency.callerPhone,
            description: emergency.description,
            severity: emergency.severity,
            status: emergency.status,
            address: emergency.address,
            location: {
                type: emergency.location.type,
                coordinates: emergency.location.coordinates,
            },
            assignedHospitalId: emergency.assignedHospitalId?.toString(),
            assignedRescueTeamId: emergency.assignedRescueTeamId?.toString(),
            dispatcherId: emergency.dispatcherId?.toString(),
            patientCount: emergency.patientCount,
            emergencyType: emergency.emergencyType,
            notes: emergency.notes,
            estimatedArrival: emergency.estimatedArrival,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.SosService = SosService;
exports.SosService = SosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(emergency_request_schema_1.EmergencyRequest.name)),
    __param(1, (0, mongoose_1.InjectModel)(emergency_response_schema_1.EmergencyResponse.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        websocket_gateway_1.AppWebSocketGateway])
], SosService);
//# sourceMappingURL=sos.service.js.map