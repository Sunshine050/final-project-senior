import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RescueLocationDto {
  @ApiProperty({ description: 'Location type', example: 'Point' })
  type: string;

  @ApiProperty({ description: 'Coordinates [longitude, latitude]', example: [100.5018, 13.7563] })
  coordinates: [number, number];
}

export class RescueTeamResponseDto {
  @ApiProperty({ description: 'Rescue team ID' })
  id: string;

  @ApiProperty({ description: 'Rescue team name' })
  name: string;

  @ApiProperty({ description: 'Organization type' })
  type: string;

  @ApiProperty({ description: 'Base address' })
  address: string;

  @ApiProperty({ description: 'Contact phone' })
  phone: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  email?: string;

  @ApiProperty({ type: RescueLocationDto, description: 'GeoJSON location' })
  location: RescueLocationDto;

  @ApiProperty({ description: 'Whether team is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Total vehicle/unit capacity' })
  capacity: number;

  @ApiProperty({ description: 'Available units' })
  availableCapacity: number;

  @ApiProperty({ type: [String], description: 'Services provided' })
  services: string[];

  @ApiPropertyOptional({ description: 'Distance in meters (for nearby queries)' })
  distance?: number;
}

export class RescueTeamListResponseDto {
  @ApiProperty({ type: [RescueTeamResponseDto], description: 'List of rescue teams' })
  data: RescueTeamResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;
}

