import { EmergencySeverity } from '../../../common/enums';
export declare class PatientInfoDto {
    name?: string;
    age?: number;
    gender?: string;
    condition?: string;
}
export declare class LocationDto {
    longitude: number;
    latitude: number;
}
export declare class CreateEmergencyDto {
    callerName: string;
    callerPhone: string;
    description: string;
    severity: EmergencySeverity;
    address: string;
    location: LocationDto;
    patientCount?: number;
    patients?: PatientInfoDto[];
    emergencyType?: string;
    notes?: string;
}
