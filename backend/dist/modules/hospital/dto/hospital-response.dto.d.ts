export declare class HospitalLocationDto {
    type: string;
    coordinates: [number, number];
}
export declare class OperatingHoursDto {
    open: string;
    close: string;
    is24Hours: boolean;
}
export declare class HospitalResponseDto {
    id: string;
    name: string;
    type: string;
    address: string;
    phone: string;
    email?: string;
    location: HospitalLocationDto;
    isActive: boolean;
    capacity: number;
    availableCapacity: number;
    operatingHours?: OperatingHoursDto;
    services: string[];
    distance?: number;
}
export declare class HospitalListResponseDto {
    data: HospitalResponseDto[];
    total: number;
}
