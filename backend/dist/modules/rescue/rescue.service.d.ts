import { Model } from 'mongoose';
import { OrganizationDocument } from '../../schemas/organization.schema';
import { RescueTeamResponseDto, RescueTeamListResponseDto } from './dto';
export declare class RescueService {
    private organizationModel;
    constructor(organizationModel: Model<OrganizationDocument>);
    getAllRescueTeams(): Promise<RescueTeamListResponseDto>;
    getAvailableRescueTeams(): Promise<RescueTeamResponseDto[]>;
    getRescueTeamById(id: string): Promise<RescueTeamResponseDto | null>;
    updateAvailability(id: string, availableCapacity: number): Promise<RescueTeamResponseDto | null>;
    private mapToResponseDto;
}
