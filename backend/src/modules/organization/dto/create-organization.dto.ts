import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrganizationType } from '../../../common/enums';

export class LocationDto {
  @ApiProperty({ description: 'Longitude coordinate', example: 100.5018 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ description: 'Latitude coordinate', example: 13.7563 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;
}

export class OperatingHoursDto {
  @ApiProperty({ description: 'Opening time', example: '08:00' })
  @IsString()
  open: string;

  @ApiProperty({ description: 'Closing time', example: '20:00' })
  @IsString()
  close: string;

  @ApiProperty({ description: 'Whether open 24 hours', default: false })
  @IsBoolean()
  is24Hours: boolean;
}

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Bangkok Hospital' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: OrganizationType, description: 'Organization type' })
  @IsEnum(OrganizationType)
  type: OrganizationType;

  @ApiProperty({ description: 'Organization address', example: '123 Main Street, Bangkok' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Contact phone number', example: '+66212345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Contact email', example: 'contact@hospital.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ type: LocationDto, description: 'GPS coordinates' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({ description: 'Total capacity (beds/vehicles)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Available capacity', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availableCapacity?: number;

  @ApiPropertyOptional({ type: OperatingHoursDto, description: 'Operating hours' })
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  operatingHours?: OperatingHoursDto;

  @ApiPropertyOptional({ type: [String], description: 'Services provided' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];
}

