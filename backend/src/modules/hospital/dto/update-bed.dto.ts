import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateBedAvailabilityDto {
  @ApiProperty({ description: 'Number of available beds' })
  @IsNumber()
  @Min(0)
  availableBeds: number;
}

