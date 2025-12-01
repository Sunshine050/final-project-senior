import {
  Controller,
  Get,
  Patch,
  Query,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HospitalService } from './hospital.service';
import {
  HospitalResponseDto,
  HospitalListResponseDto,
  NearbyQueryDto,
  UpdateBedAvailabilityDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hospitals' })
  @ApiResponse({ status: 200, description: 'List of hospitals', type: HospitalListResponseDto })
  async getAllHospitals(): Promise<HospitalListResponseDto> {
    return this.hospitalService.getAllHospitals();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby hospitals using geospatial query' })
  @ApiResponse({ status: 200, description: 'Nearby hospitals sorted by distance', type: [HospitalResponseDto] })
  async getNearbyHospitals(@Query() query: NearbyQueryDto): Promise<HospitalResponseDto[]> {
    return this.hospitalService.getNearbyHospitals(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hospital by ID' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({ status: 200, description: 'Hospital details', type: HospitalResponseDto })
  @ApiResponse({ status: 404, description: 'Hospital not found' })
  async getHospitalById(@Param('id') id: string): Promise<HospitalResponseDto> {
    const hospital = await this.hospitalService.getHospitalById(id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    return hospital;
  }

  @Patch(':id/beds')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HOSPITAL_STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hospital bed availability' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({ status: 200, description: 'Bed availability updated', type: HospitalResponseDto })
  @ApiResponse({ status: 404, description: 'Hospital not found' })
  async updateBedAvailability(
    @Param('id') id: string,
    @Body() updateDto: UpdateBedAvailabilityDto,
  ): Promise<HospitalResponseDto> {
    return this.hospitalService.updateBedAvailability(id, updateDto);
  }
}
