import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { EmergencyRequest, EmergencyRequestDocument } from '../../schemas/emergency-request.schema';
import { EmergencyResponse, EmergencyResponseDocument } from '../../schemas/emergency-response.schema';
import {
  CreateEmergencyDto,
  AssignEmergencyDto,
  UpdateStatusDto,
  QueryEmergencyDto,
  EmergencyResponseDto,
  EmergencyListResponseDto,
} from './dto';
import { EmergencyStatus } from '../../common/enums';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { EmergencyEventPayload } from '../../common/interfaces/socket.interface';

@Injectable()
export class SosService {
  constructor(
    @InjectModel(EmergencyRequest.name)
    private emergencyRequestModel: Model<EmergencyRequestDocument>,
    @InjectModel(EmergencyResponse.name)
    private emergencyResponseModel: Model<EmergencyResponseDocument>,
    private readonly wsGateway: AppWebSocketGateway,
  ) {}

  async createEmergency(
    createDto: CreateEmergencyDto,
    requesterId?: string,
  ): Promise<EmergencyResponseDto> {
    const emergency = new this.emergencyRequestModel({
      ...createDto,
      requesterId: requesterId ? new Types.ObjectId(requesterId) : undefined,
      location: {
        type: 'Point',
        coordinates: [createDto.location.longitude, createDto.location.latitude],
      },
      status: EmergencyStatus.PENDING,
      statusHistory: [
        {
          status: EmergencyStatus.PENDING,
          timestamp: new Date(),
          notes: 'Emergency request created',
        },
      ],
      priorityScore: this.calculatePriorityScore(createDto.severity),
    });

    await emergency.save();
    
    const responseDto = this.mapToResponseDto(emergency);

    // Emit WebSocket event for new emergency
    this.emitNewEmergency(emergency);

    return responseDto;
  }

  async assignEmergency(
    id: string,
    assignDto: AssignEmergencyDto,
    dispatcherId?: string,
  ): Promise<EmergencyResponseDto> {
    const emergency = await this.findEmergencyById(id);

    if (!assignDto.hospitalId && !assignDto.rescueTeamId) {
      throw new BadRequestException('Either hospitalId or rescueTeamId must be provided');
    }

    if (assignDto.hospitalId) {
      emergency.assignedHospitalId = new Types.ObjectId(assignDto.hospitalId);
    }

    if (assignDto.rescueTeamId) {
      emergency.assignedRescueTeamId = new Types.ObjectId(assignDto.rescueTeamId);
    }

    if (dispatcherId) {
      emergency.dispatcherId = new Types.ObjectId(dispatcherId);
    }

    // Update status to assigned if still pending
    if (emergency.status === EmergencyStatus.PENDING) {
      emergency.status = EmergencyStatus.ASSIGNED;
      emergency.statusHistory.push({
        status: EmergencyStatus.ASSIGNED,
        timestamp: new Date(),
        updatedBy: dispatcherId ? new Types.ObjectId(dispatcherId) : undefined,
        notes: assignDto.notes || 'Emergency assigned',
      });
    }

    await emergency.save();

    // Create emergency response record
    if (assignDto.rescueTeamId) {
      await this.emergencyResponseModel.create({
        emergencyRequestId: emergency._id,
        organizationId: new Types.ObjectId(assignDto.rescueTeamId),
        responderId: dispatcherId ? new Types.ObjectId(dispatcherId) : undefined,
        responseType: 'rescue',
        dispatchTime: new Date(),
      });
    }

    const responseDto = this.mapToResponseDto(emergency);

    // Emit WebSocket event for emergency assigned
    this.emitEmergencyAssigned(emergency);

    return responseDto;
  }

  async updateStatus(
    id: string,
    updateDto: UpdateStatusDto,
    userId?: string,
  ): Promise<EmergencyResponseDto> {
    const emergency = await this.findEmergencyById(id);

    // Validate status transition
    this.validateStatusTransition(emergency.status, updateDto.status);

    emergency.status = updateDto.status;
    emergency.statusHistory.push({
      status: updateDto.status,
      timestamp: new Date(),
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
      notes: updateDto.notes,
    });

    if (updateDto.estimatedArrival) {
      emergency.estimatedArrival = new Date(updateDto.estimatedArrival);
    }

    if (updateDto.status === EmergencyStatus.ON_SCENE) {
      emergency.actualArrival = new Date();
    }

    if (updateDto.status === EmergencyStatus.COMPLETED) {
      emergency.completedAt = new Date();
    }

    await emergency.save();
    
    const responseDto = this.mapToResponseDto(emergency);

    // Emit WebSocket event for status update
    this.emitStatusUpdate(emergency);

    return responseDto;
  }

  async getAllEmergencies(query: QueryEmergencyDto): Promise<EmergencyListResponseDto> {
    const filter: FilterQuery<EmergencyRequestDocument> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.severity) {
      filter.severity = query.severity;
    }

    if (query.hospitalId) {
      filter.assignedHospitalId = new Types.ObjectId(query.hospitalId);
    }

    if (query.rescueTeamId) {
      filter.assignedRescueTeamId = new Types.ObjectId(query.rescueTeamId);
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

  async getActiveEmergencies(hospitalId: string): Promise<EmergencyResponseDto[]> {
    const activeStatuses = [
      EmergencyStatus.PENDING,
      EmergencyStatus.ASSIGNED,
      EmergencyStatus.EN_ROUTE,
      EmergencyStatus.ON_SCENE,
      EmergencyStatus.TRANSPORTING,
    ];

    const emergencies = await this.emergencyRequestModel
      .find({
        status: { $in: activeStatuses },
        $or: [
          { assignedHospitalId: new Types.ObjectId(hospitalId) },
          { assignedHospitalId: { $exists: false } },
        ],
      })
      .sort({ priorityScore: -1, createdAt: -1 })
      .exec();

    return emergencies.map((e) => this.mapToResponseDto(e));
  }

  async getAssignedCases(rescueTeamId?: string, includeAllForAdmin = false): Promise<EmergencyResponseDto[]> {
    const activeStatuses = [
      EmergencyStatus.ASSIGNED,
      EmergencyStatus.EN_ROUTE,
      EmergencyStatus.ON_SCENE,
      EmergencyStatus.TRANSPORTING,
    ];

    const filter: FilterQuery<EmergencyRequestDocument> = {
      status: { $in: activeStatuses },
    };

    if (rescueTeamId) {
      if (!Types.ObjectId.isValid(rescueTeamId)) {
        throw new BadRequestException('Invalid rescue team ID');
      }

      filter.assignedRescueTeamId = new Types.ObjectId(rescueTeamId);
    } else if (!includeAllForAdmin) {
      throw new BadRequestException('Rescue team ID is required');
    }

    const emergencies = await this.emergencyRequestModel
      .find(filter)
      .sort({ priorityScore: -1, createdAt: -1 })
      .exec();

    return emergencies.map((e) => this.mapToResponseDto(e));
  }

  async getEmergencyById(id: string): Promise<EmergencyResponseDto> {
    const emergency = await this.findEmergencyById(id);
    return this.mapToResponseDto(emergency);
  }

  // ==================== WebSocket Emit Methods ====================

  private emitNewEmergency(emergency: EmergencyRequestDocument): void {
    const payload = this.createEventPayload(emergency);
    this.wsGateway.emitNewEmergency(payload);
  }

  private emitEmergencyAssigned(emergency: EmergencyRequestDocument): void {
    const payload = this.createEventPayload(emergency);
    this.wsGateway.emitEmergencyAssigned(payload);
  }

  private emitStatusUpdate(emergency: EmergencyRequestDocument): void {
    const payload = this.createEventPayload(emergency);
    this.wsGateway.emitEmergencyStatusUpdate(payload);
  }

  private createEventPayload(emergency: EmergencyRequestDocument): EmergencyEventPayload {
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

  // ==================== Private Methods ====================

  private async findEmergencyById(id: string): Promise<EmergencyRequestDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid emergency ID');
    }

    const emergency = await this.emergencyRequestModel.findById(id).exec();
    if (!emergency) {
      throw new NotFoundException('Emergency not found');
    }

    return emergency;
  }

  private calculatePriorityScore(severity: string): number {
    const severityScores: Record<string, number> = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    };
    return severityScores[severity] || 50;
  }

  private validateStatusTransition(currentStatus: EmergencyStatus, newStatus: EmergencyStatus): void {
    const validTransitions: Record<EmergencyStatus, EmergencyStatus[]> = {
      [EmergencyStatus.PENDING]: [EmergencyStatus.ASSIGNED, EmergencyStatus.CANCELLED],
      [EmergencyStatus.ASSIGNED]: [EmergencyStatus.EN_ROUTE, EmergencyStatus.CANCELLED],
      [EmergencyStatus.EN_ROUTE]: [EmergencyStatus.ON_SCENE, EmergencyStatus.CANCELLED],
      [EmergencyStatus.ON_SCENE]: [EmergencyStatus.TRANSPORTING, EmergencyStatus.COMPLETED, EmergencyStatus.CANCELLED],
      [EmergencyStatus.TRANSPORTING]: [EmergencyStatus.COMPLETED, EmergencyStatus.CANCELLED],
      [EmergencyStatus.COMPLETED]: [],
      [EmergencyStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
      );
    }
  }

  private mapToResponseDto(emergency: EmergencyRequestDocument): EmergencyResponseDto {
    const doc = emergency as EmergencyRequestDocument & { createdAt: Date; updatedAt: Date };
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
}
