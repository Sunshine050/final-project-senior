import { OrganizationType } from '../../../common/enums';
export declare class LocationDto {
    longitude: number;
    latitude: number;
}
export declare class OperatingHoursDto {
    open: string;
    close: string;
    is24Hours: boolean;
}
export declare class CreateOrganizationDto {
    name: string;
    type: OrganizationType;
    address: string;
    phone: string;
    email?: string;
    location: LocationDto;
    capacity?: number;
    availableCapacity?: number;
    operatingHours?: OperatingHoursDto;
    services?: string[];
}
