import { OrganizationType } from '../../../common/enums';
export declare class OrganizationLocationDto {
    type: string;
    coordinates: [number, number];
}
export declare class OrganizationOperatingHoursDto {
    open: string;
    close: string;
    is24Hours: boolean;
}
export declare class OrganizationResponseDto {
    id: string;
    name: string;
    type: OrganizationType;
    address: string;
    phone: string;
    email?: string;
    location: OrganizationLocationDto;
    isActive: boolean;
    capacity: number;
    availableCapacity: number;
    operatingHours?: OrganizationOperatingHoursDto;
    services: string[];
    createdAt: Date;
    updatedAt: Date;
}
