export declare class RescueLocationDto {
    type: string;
    coordinates: [number, number];
}
export declare class RescueTeamResponseDto {
    id: string;
    name: string;
    type: string;
    address: string;
    phone: string;
    email?: string;
    location: RescueLocationDto;
    isActive: boolean;
    capacity: number;
    availableCapacity: number;
    services: string[];
    distance?: number;
}
export declare class RescueTeamListResponseDto {
    data: RescueTeamResponseDto[];
    total: number;
}
