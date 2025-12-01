import { EmergencyStatus, EmergencySeverity } from '../../../common/enums';
export declare class QueryEmergencyDto {
    status?: EmergencyStatus;
    severity?: EmergencySeverity;
    hospitalId?: string;
    rescueTeamId?: string;
    page?: number;
    limit?: number;
}
