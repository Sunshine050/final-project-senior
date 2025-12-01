import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { OrganizationType } from '../../common/enums';
import { HospitalResponseDto, HospitalListResponseDto, NearbyQueryDto, UpdateBedAvailabilityDto } from './dto';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { HospitalBedUpdatePayload } from '../../common/interfaces/socket.interface';

interface NearbyHospitalResult {
  _id: unknown;
  name: string;
  type: string;
  address: string;
  phone: string;
  email?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  isActive: boolean;
  capacity: number;
  availableCapacity: number;
  operatingHours?: {
    open: string;
    close: string;
    is24Hours: boolean;
  };
  services: string[];
  distance: number;
}

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private readonly wsGateway: AppWebSocketGateway,
  ) {}

  async getAllHospitals(): Promise<HospitalListResponseDto> {
    const hospitals = await this.organizationModel
      .find({
        type: OrganizationType.HOSPITAL,
        isActive: true,
      })
      .sort({ name: 1 })
      .exec();

    return {
      data: hospitals.map((h) => this.mapToResponseDto(h)),
      total: hospitals.length,
    };
  }

  async getNearbyHospitals(query: NearbyQueryDto): Promise<HospitalResponseDto[]> {
    const { longitude, latitude, maxDistance, limit } = query;

    // Use MongoDB geospatial query with $geoNear aggregation
    const hospitals = await this.organizationModel.aggregate<NearbyHospitalResult>([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: maxDistance || 10000,
          spherical: true,
          query: {
            type: OrganizationType.HOSPITAL,
            isActive: true,
          },
        },
      },
      {
        $limit: limit || 10,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          type: 1,
          address: 1,
          phone: 1,
          email: 1,
          location: 1,
          isActive: 1,
          capacity: 1,
          availableCapacity: 1,
          operatingHours: 1,
          services: 1,
          distance: { $round: ['$distance', 0] },
        },
      },
    ]);

    return hospitals.map((h) => this.mapAggregateToResponseDto(h));
  }

  async getHospitalById(id: string): Promise<HospitalResponseDto | null> {
    const hospital = await this.organizationModel.findById(id).exec();
    if (!hospital || hospital.type !== OrganizationType.HOSPITAL) {
      return null;
    }
    return this.mapToResponseDto(hospital);
  }

  async updateBedAvailability(
    hospitalId: string,
    updateDto: UpdateBedAvailabilityDto,
  ): Promise<HospitalResponseDto> {
    const hospital = await this.organizationModel.findOneAndUpdate(
      {
        _id: hospitalId,
        type: OrganizationType.HOSPITAL,
      },
      {
        availableCapacity: updateDto.availableBeds,
      },
      { new: true },
    ).exec();

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Emit WebSocket event for bed update
    this.emitBedUpdate(hospital);

    return this.mapToResponseDto(hospital);
  }

  // ==================== WebSocket Emit Methods ====================

  private emitBedUpdate(hospital: OrganizationDocument): void {
    const payload: HospitalBedUpdatePayload = {
      hospitalId: hospital._id.toString(),
      hospitalName: hospital.name,
      totalBeds: hospital.capacity,
      availableBeds: hospital.availableCapacity,
      timestamp: new Date(),
    };

    this.wsGateway.emitHospitalBedUpdate(payload);
  }

  // ==================== Private Methods ====================

  private mapToResponseDto(hospital: OrganizationDocument): HospitalResponseDto {
    return {
      id: hospital._id.toString(),
      name: hospital.name,
      type: hospital.type,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
      location: {
        type: hospital.location.type,
        coordinates: hospital.location.coordinates,
      },
      isActive: hospital.isActive,
      capacity: hospital.capacity,
      availableCapacity: hospital.availableCapacity,
      operatingHours: hospital.operatingHours,
      services: hospital.services,
    };
  }

  private mapAggregateToResponseDto(hospital: NearbyHospitalResult): HospitalResponseDto {
    return {
      id: String(hospital._id),
      name: hospital.name,
      type: hospital.type,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
      location: {
        type: hospital.location.type,
        coordinates: hospital.location.coordinates,
      },
      isActive: hospital.isActive,
      capacity: hospital.capacity,
      availableCapacity: hospital.availableCapacity,
      operatingHours: hospital.operatingHours,
      services: hospital.services,
      distance: hospital.distance,
    };
  }
}
