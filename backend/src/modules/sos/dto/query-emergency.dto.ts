import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, Min, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { EmergencyStatus, EmergencySeverity } from '../../../common/enums';

export class QueryEmergencyDto {
  @ApiPropertyOptional({ enum: EmergencyStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(EmergencyStatus)
  status?: EmergencyStatus;

  @ApiPropertyOptional({ enum: EmergencySeverity, description: 'Filter by severity' })
  @IsOptional()
  @IsEnum(EmergencySeverity)
  severity?: EmergencySeverity;

  @ApiPropertyOptional({ description: 'Filter by assigned hospital' })
  @IsOptional()
  @IsMongoId()
  hospitalId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned rescue team' })
  @IsOptional()
  @IsMongoId()
  rescueTeamId?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}

