import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class AssignEmergencyDto {
  @ApiPropertyOptional({ description: 'Hospital ID to assign' })
  @IsOptional()
  @IsMongoId()
  hospitalId?: string;

  @ApiPropertyOptional({ description: 'Rescue team ID to assign' })
  @IsOptional()
  @IsMongoId()
  rescueTeamId?: string;

  @ApiPropertyOptional({ description: 'Assignment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

