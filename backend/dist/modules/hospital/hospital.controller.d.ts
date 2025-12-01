import { HospitalService } from './hospital.service';
import { HospitalResponseDto, HospitalListResponseDto, NearbyQueryDto, UpdateBedAvailabilityDto } from './dto';
export declare class HospitalController {
    private readonly hospitalService;
    constructor(hospitalService: HospitalService);
    getAllHospitals(): Promise<HospitalListResponseDto>;
    getNearbyHospitals(query: NearbyQueryDto): Promise<HospitalResponseDto[]>;
    getHospitalById(id: string): Promise<HospitalResponseDto>;
    updateBedAvailability(id: string, updateDto: UpdateBedAvailabilityDto): Promise<HospitalResponseDto>;
}
