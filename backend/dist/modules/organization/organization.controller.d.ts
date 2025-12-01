import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, OrganizationResponseDto } from './dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    create(createDto: CreateOrganizationDto): Promise<OrganizationResponseDto>;
    findAll(): Promise<OrganizationResponseDto[]>;
    findById(id: string): Promise<OrganizationResponseDto>;
    update(id: string, updateDto: Partial<CreateOrganizationDto>): Promise<OrganizationResponseDto>;
    delete(id: string): Promise<void>;
}
