import { Model } from 'mongoose';
import { OrganizationDocument } from '../../schemas/organization.schema';
import { CreateOrganizationDto, OrganizationResponseDto } from './dto';
export declare class OrganizationService {
    private organizationModel;
    constructor(organizationModel: Model<OrganizationDocument>);
    create(createDto: CreateOrganizationDto): Promise<OrganizationResponseDto>;
    findAll(): Promise<OrganizationResponseDto[]>;
    findById(id: string): Promise<OrganizationResponseDto>;
    update(id: string, updateDto: Partial<CreateOrganizationDto>): Promise<OrganizationResponseDto>;
    delete(id: string): Promise<void>;
    private mapToResponseDto;
}
