import { EmergencyStatus, EmergencySeverity } from '../../../common/enums';
export declare class EmergencyLocationDto {
    type: string;
    coordinates: [number, number];
}
export declare class EmergencyResponseDto {
    id: string;
    callerName: string;
    callerPhone: string;
    description: string;
    severity: EmergencySeverity;
    status: EmergencyStatus;
    address: string;
    location: EmergencyLocationDto;
    assignedHospitalId?: string;
    assignedRescueTeamId?: string;
    dispatcherId?: string;
    patientCount: number;
    emergencyType?: string;
    notes?: string;
    estimatedArrival?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class EmergencyListResponseDto {
    data: EmergencyResponseDto[];
    total: number;
    page: number;
    limit: number;
}
