import { EmergencyStatus } from '../../../common/enums';
export declare class UpdateStatusDto {
    status: EmergencyStatus;
    notes?: string;
    estimatedArrival?: string;
}
