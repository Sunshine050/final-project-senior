import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmergencyStatus, EmergencySeverity } from '../../../common/enums';

export class EmergencyLocationDto {
  @ApiProperty({ description: 'Location type', example: 'Point' })
  type: string;

  @ApiProperty({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] })
  coordinates: [number, number];
}

export class EmergencyResponseDto {
  @ApiProperty({ description: 'Emergency ID' })
  id: string;

  @ApiProperty({ description: 'Caller name' })
  callerName: string;

  @ApiProperty({ description: 'Caller phone' })
  callerPhone: string;

  @ApiProperty({ description: 'Emergency description' })
  description: string;

  @ApiProperty({ enum: EmergencySeverity, description: 'Severity level' })
  severity: EmergencySeverity;

  @ApiProperty({ enum: EmergencyStatus, description: 'Current status' })
  status: EmergencyStatus;

  @ApiProperty({ description: 'Emergency address' })
  address: string;

  @ApiProperty({ type: EmergencyLocationDto, description: 'GeoJSON location' })
  location: EmergencyLocationDto;

  @ApiPropertyOptional({ description: 'Assigned hospital ID' })
  assignedHospitalId?: string;

  @ApiPropertyOptional({ description: 'Assigned rescue team ID' })
  assignedRescueTeamId?: string;

  @ApiPropertyOptional({ description: 'Dispatcher ID' })
  dispatcherId?: string;

  @ApiProperty({ description: 'Number of patients' })
  patientCount: number;

  @ApiPropertyOptional({ description: 'Emergency type' })
  emergencyType?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Estimated arrival time' })
  estimatedArrival?: Date;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}

export class EmergencyListResponseDto {
  @ApiProperty({ type: [EmergencyResponseDto], description: 'List of emergencies' })
  data: EmergencyResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;
}

