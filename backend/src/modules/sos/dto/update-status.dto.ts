import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { EmergencyStatus } from '../../../common/enums';

export class UpdateStatusDto {
  @ApiProperty({ enum: EmergencyStatus, description: 'New status' })
  @IsEnum(EmergencyStatus)
  status: EmergencyStatus;

  @ApiPropertyOptional({ description: 'Status update notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Estimated arrival time' })
  @IsOptional()
  @IsDateString()
  estimatedArrival?: string;
}

