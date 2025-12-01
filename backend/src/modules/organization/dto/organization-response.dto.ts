import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationType } from '../../../common/enums';

export class OrganizationLocationDto {
  @ApiProperty({ description: 'Location type', example: 'Point' })
  type: string;

  @ApiProperty({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] })
  coordinates: [number, number];
}

export class OrganizationOperatingHoursDto {
  @ApiProperty({ description: 'Opening time', example: '08:00' })
  open: string;

  @ApiProperty({ description: 'Closing time', example: '20:00' })
  close: string;

  @ApiProperty({ description: 'Whether open 24 hours' })
  is24Hours: boolean;
}

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Organization ID' })
  id: string;

  @ApiProperty({ description: 'Organization name' })
  name: string;

  @ApiProperty({ enum: OrganizationType, description: 'Organization type' })
  type: OrganizationType;

  @ApiProperty({ description: 'Organization address' })
  address: string;

  @ApiProperty({ description: 'Contact phone' })
  phone: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  email?: string;

  @ApiProperty({ type: OrganizationLocationDto, description: 'GeoJSON location' })
  location: OrganizationLocationDto;

  @ApiProperty({ description: 'Whether organization is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Total capacity' })
  capacity: number;

  @ApiProperty({ description: 'Available capacity' })
  availableCapacity: number;

  @ApiPropertyOptional({ type: OrganizationOperatingHoursDto, description: 'Operating hours' })
  operatingHours?: OrganizationOperatingHoursDto;

  @ApiProperty({ type: [String], description: 'Services provided' })
  services: string[];

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}

