import { Model } from 'mongoose';
import { EmergencyRequestDocument } from '../../schemas/emergency-request.schema';
import { EmergencyResponseDocument } from '../../schemas/emergency-response.schema';
import { CreateEmergencyDto, AssignEmergencyDto, UpdateStatusDto, QueryEmergencyDto, EmergencyResponseDto, EmergencyListResponseDto } from './dto';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
export declare class SosService {
    private emergencyRequestModel;
    private emergencyResponseModel;
    private readonly wsGateway;
    constructor(emergencyRequestModel: Model<EmergencyRequestDocument>, emergencyResponseModel: Model<EmergencyResponseDocument>, wsGateway: AppWebSocketGateway);
    createEmergency(createDto: CreateEmergencyDto, requesterId?: string): Promise<EmergencyResponseDto>;
    assignEmergency(id: string, assignDto: AssignEmergencyDto, dispatcherId?: string): Promise<EmergencyResponseDto>;
    updateStatus(id: string, updateDto: UpdateStatusDto, userId?: string): Promise<EmergencyResponseDto>;
    getAllEmergencies(query: QueryEmergencyDto): Promise<EmergencyListResponseDto>;
    getActiveEmergencies(hospitalId?: string): Promise<EmergencyResponseDto[]>;
    getAssignedCases(rescueTeamId?: string, includeAllForAdmin?: boolean): Promise<EmergencyResponseDto[]>;
    getEmergencyById(id: string): Promise<EmergencyResponseDto>;
    private emitNewEmergency;
    private emitEmergencyAssigned;
    private emitStatusUpdate;
    private createEventPayload;
    private findEmergencyById;
    private calculatePriorityScore;
    private validateStatusTransition;
    private mapToResponseDto;
}
