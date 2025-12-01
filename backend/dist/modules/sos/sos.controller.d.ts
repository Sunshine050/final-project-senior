import { SosService } from './sos.service';
import { CreateEmergencyDto, AssignEmergencyDto, UpdateStatusDto, QueryEmergencyDto, EmergencyResponseDto, EmergencyListResponseDto } from './dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class SosController {
    private readonly sosService;
    constructor(sosService: SosService);
    createEmergency(createDto: CreateEmergencyDto): Promise<EmergencyResponseDto>;
    assignEmergency(id: string, assignDto: AssignEmergencyDto, user: JwtPayload): Promise<EmergencyResponseDto>;
    updateStatus(id: string, updateDto: UpdateStatusDto, user: JwtPayload): Promise<EmergencyResponseDto>;
    getAllEmergencies(query: QueryEmergencyDto): Promise<EmergencyListResponseDto>;
    getActiveEmergencies(user: JwtPayload): Promise<EmergencyResponseDto[]>;
    getAssignedCases(user: JwtPayload): Promise<EmergencyResponseDto[]>;
    getEmergencyById(id: string): Promise<EmergencyResponseDto>;
}
