import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SosService } from './sos.service';
import {
  CreateEmergencyDto,
  AssignEmergencyDto,
  UpdateStatusDto,
  QueryEmergencyDto,
  EmergencyResponseDto,
  EmergencyListResponseDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';

@ApiTags('sos')
@Controller('sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new emergency request' })
  @ApiResponse({ status: 201, description: 'Emergency created', type: EmergencyResponseDto })
  async createEmergency(
    @Body() createDto: CreateEmergencyDto,
  ): Promise<EmergencyResponseDto> {
    return this.sosService.createEmergency(createDto);
  }

  @Post(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DISPATCHER, Role.HOSPITAL_STAFF)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign emergency to hospital/rescue team' })
  @ApiParam({ name: 'id', description: 'Emergency ID' })
  @ApiResponse({ status: 200, description: 'Emergency assigned', type: EmergencyResponseDto })
  @ApiResponse({ status: 404, description: 'Emergency not found' })
  async assignEmergency(
    @Param('id') id: string,
    @Body() assignDto: AssignEmergencyDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<EmergencyResponseDto> {
    return this.sosService.assignEmergency(id, assignDto, user.sub);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DISPATCHER, Role.HOSPITAL_STAFF, Role.RESCUE_TEAM)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update emergency status' })
  @ApiParam({ name: 'id', description: 'Emergency ID' })
  @ApiResponse({ status: 200, description: 'Status updated', type: EmergencyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Emergency not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateStatusDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<EmergencyResponseDto> {
    return this.sosService.updateStatus(id, updateDto, user.sub);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DISPATCHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all emergencies with filtering' })
  @ApiResponse({ status: 200, description: 'List of emergencies', type: EmergencyListResponseDto })
  async getAllEmergencies(
    @Query() query: QueryEmergencyDto,
  ): Promise<EmergencyListResponseDto> {
    return this.sosService.getAllEmergencies(query);
  }

  @Get('dashboard/active-emergencies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DISPATCHER, Role.HOSPITAL_STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active emergencies for hospital dashboard' })
  @ApiResponse({ status: 200, description: 'Active emergencies', type: [EmergencyResponseDto] })
  async getActiveEmergencies(
    @CurrentUser() user: JwtPayload,
  ): Promise<EmergencyResponseDto[]> {
    const organizationId = user.organizationId;
    return this.sosService.getActiveEmergencies(organizationId);
  }

  @Get('rescue/assigned-cases')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RESCUE_TEAM)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get assigned cases for rescue team' })
  @ApiResponse({ status: 200, description: 'Assigned cases', type: [EmergencyResponseDto] })
  async getAssignedCases(
    @CurrentUser() user: JwtPayload,
  ): Promise<EmergencyResponseDto[]> {
    const organizationId = user.organizationId;
    const includeAllForAdmin = user.role === Role.ADMIN && !organizationId;
    return this.sosService.getAssignedCases(organizationId, includeAllForAdmin);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get emergency by ID' })
  @ApiParam({ name: 'id', description: 'Emergency ID' })
  @ApiResponse({ status: 200, description: 'Emergency details', type: EmergencyResponseDto })
  @ApiResponse({ status: 404, description: 'Emergency not found' })
  async getEmergencyById(@Param('id') id: string): Promise<EmergencyResponseDto> {
    return this.sosService.getEmergencyById(id);
  }
}

