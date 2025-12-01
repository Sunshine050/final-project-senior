import { RescueService } from './rescue.service';
import { RescueTeamResponseDto, RescueTeamListResponseDto } from './dto';
export declare class RescueController {
    private readonly rescueService;
    constructor(rescueService: RescueService);
    getAllRescueTeams(): Promise<RescueTeamListResponseDto>;
    getAvailableRescueTeams(): Promise<RescueTeamResponseDto[]>;
    getRescueTeamById(id: string): Promise<RescueTeamResponseDto>;
}
