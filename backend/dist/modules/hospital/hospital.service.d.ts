import { Model } from 'mongoose';
import { OrganizationDocument } from '../../schemas/organization.schema';
import { HospitalResponseDto, HospitalListResponseDto, NearbyQueryDto, UpdateBedAvailabilityDto } from './dto';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
export declare class HospitalService {
    private organizationModel;
    private readonly wsGateway;
    constructor(organizationModel: Model<OrganizationDocument>, wsGateway: AppWebSocketGateway);
    getAllHospitals(): Promise<HospitalListResponseDto>;
    getNearbyHospitals(query: NearbyQueryDto): Promise<HospitalResponseDto[]>;
    getHospitalById(id: string): Promise<HospitalResponseDto | null>;
    updateBedAvailability(hospitalId: string, updateDto: UpdateBedAvailabilityDto): Promise<HospitalResponseDto>;
    private emitBedUpdate;
    private mapToResponseDto;
    private mapAggregateToResponseDto;
}
