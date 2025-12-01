import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { OrganizationType } from '../../common/enums';
import { RescueTeamResponseDto, RescueTeamListResponseDto } from './dto';

@Injectable()
export class RescueService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async getAllRescueTeams(): Promise<RescueTeamListResponseDto> {
    const teams = await this.organizationModel
      .find({
        type: OrganizationType.RESCUE_TEAM,
        isActive: true,
      })
      .sort({ name: 1 })
      .exec();

    return {
      data: teams.map((t) => this.mapToResponseDto(t)),
      total: teams.length,
    };
  }

  async getAvailableRescueTeams(): Promise<RescueTeamResponseDto[]> {
    const teams = await this.organizationModel
      .find({
        type: OrganizationType.RESCUE_TEAM,
        isActive: true,
        availableCapacity: { $gt: 0 },
      })
      .sort({ availableCapacity: -1, name: 1 })
      .exec();

    return teams.map((t) => this.mapToResponseDto(t));
  }

  async getRescueTeamById(id: string): Promise<RescueTeamResponseDto | null> {
    const team = await this.organizationModel.findById(id).exec();
    if (!team || team.type !== OrganizationType.RESCUE_TEAM) {
      return null;
    }
    return this.mapToResponseDto(team);
  }

  async updateAvailability(id: string, availableCapacity: number): Promise<RescueTeamResponseDto | null> {
    const team = await this.organizationModel
      .findByIdAndUpdate(
        id,
        { availableCapacity },
        { new: true },
      )
      .exec();

    if (!team) {
      return null;
    }

    return this.mapToResponseDto(team);
  }

  private mapToResponseDto(team: OrganizationDocument): RescueTeamResponseDto {
    return {
      id: team._id.toString(),
      name: team.name,
      type: team.type,
      address: team.address,
      phone: team.phone,
      email: team.email,
      location: {
        type: team.location.type,
        coordinates: team.location.coordinates,
      },
      isActive: team.isActive,
      capacity: team.capacity,
      availableCapacity: team.availableCapacity,
      services: team.services,
    };
  }
}

