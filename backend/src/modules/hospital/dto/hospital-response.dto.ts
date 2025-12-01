import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HospitalLocationDto {
  @ApiProperty({ description: 'Location type', example: 'Point' })
  type: string;

  @ApiProperty({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] })
  coordinates: [number, number];
}

export class OperatingHoursDto {
  @ApiProperty({ description: 'Opening time', example: '08:00' })
  open: string;

  @ApiProperty({ description: 'Closing time', example: '20:00' })
  close: string;

  @ApiProperty({ description: 'Whether open 24 hours' })
  is24Hours: boolean;
}

export class HospitalResponseDto {
  @ApiProperty({ description: 'Hospital ID' })
  id: string;

  @ApiProperty({ description: 'Hospital name' })
  name: string;

  @ApiProperty({ description: 'Hospital type' })
  type: string;

  @ApiProperty({ description: 'Hospital address' })
  address: string;

  @ApiProperty({ description: 'Contact phone' })
  phone: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  email?: string;

  @ApiProperty({ type: HospitalLocationDto, description: 'GeoJSON location' })
  location: HospitalLocationDto;

  @ApiProperty({ description: 'Whether hospital is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Total bed capacity' })
  capacity: number;

  @ApiProperty({ description: 'Available beds' })
  availableCapacity: number;

  @ApiPropertyOptional({ type: OperatingHoursDto, description: 'Operating hours' })
  operatingHours?: OperatingHoursDto;

  @ApiProperty({ type: [String], description: 'Services provided' })
  services: string[];

  @ApiPropertyOptional({ description: 'Distance in meters (for nearby queries)' })
  distance?: number;
}

export class HospitalListResponseDto {
  @ApiProperty({ type: [HospitalResponseDto], description: 'List of hospitals' })
  data: HospitalResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;
}

