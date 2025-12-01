import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RescueService } from './rescue.service';
import { RescueTeamResponseDto, RescueTeamListResponseDto } from './dto';

@ApiTags('rescue-teams')
@Controller('rescue-teams')
export class RescueController {
  constructor(private readonly rescueService: RescueService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rescue teams' })
  @ApiResponse({ status: 200, description: 'List of rescue teams', type: RescueTeamListResponseDto })
  async getAllRescueTeams(): Promise<RescueTeamListResponseDto> {
    return this.rescueService.getAllRescueTeams();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available rescue teams' })
  @ApiResponse({ status: 200, description: 'Available rescue teams', type: [RescueTeamResponseDto] })
  async getAvailableRescueTeams(): Promise<RescueTeamResponseDto[]> {
    return this.rescueService.getAvailableRescueTeams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rescue team by ID' })
  @ApiParam({ name: 'id', description: 'Rescue team ID' })
  @ApiResponse({ status: 200, description: 'Rescue team details', type: RescueTeamResponseDto })
  @ApiResponse({ status: 404, description: 'Rescue team not found' })
  async getRescueTeamById(@Param('id') id: string): Promise<RescueTeamResponseDto> {
    const team = await this.rescueService.getRescueTeamById(id);
    if (!team) {
      throw new NotFoundException('Rescue team not found');
    }
    return team;
  }
}

