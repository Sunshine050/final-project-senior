import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { CreateOrganizationDto, OrganizationResponseDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(createDto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    // Check if organization with same name exists
    const existing = await this.organizationModel.findOne({ name: createDto.name }).exec();
    if (existing) {
      throw new ConflictException('Organization with this name already exists');
    }

    const organization = new this.organizationModel({
      ...createDto,
      location: {
        type: 'Point',
        coordinates: [createDto.location.longitude, createDto.location.latitude],
      },
    });

    await organization.save();
    return this.mapToResponseDto(organization);
  }

  async findAll(): Promise<OrganizationResponseDto[]> {
    const organizations = await this.organizationModel.find().sort({ name: 1 }).exec();
    return organizations.map((o) => this.mapToResponseDto(o));
  }

  async findById(id: string): Promise<OrganizationResponseDto> {
    const organization = await this.organizationModel.findById(id).exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return this.mapToResponseDto(organization);
  }

  async update(id: string, updateDto: Partial<CreateOrganizationDto>): Promise<OrganizationResponseDto> {
    const { location, ...rest } = updateDto;
    const updateData: Record<string, unknown> = { ...rest };

    if (location) {
      updateData.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      };
    }

    const organization = await this.organizationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.mapToResponseDto(organization);
  }

  async delete(id: string): Promise<void> {
    const result = await this.organizationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Organization not found');
    }
  }

  private mapToResponseDto(org: OrganizationDocument): OrganizationResponseDto {
    const doc = org as OrganizationDocument & { createdAt: Date; updatedAt: Date };
    return {
      id: org._id.toString(),
      name: org.name,
      type: org.type,
      address: org.address,
      phone: org.phone,
      email: org.email,
      location: {
        type: org.location.type,
        coordinates: org.location.coordinates,
      },
      isActive: org.isActive,
      capacity: org.capacity,
      availableCapacity: org.availableCapacity,
      operatingHours: org.operatingHours,
      services: org.services,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

