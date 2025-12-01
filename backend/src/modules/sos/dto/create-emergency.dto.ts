import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmergencySeverity } from '../../../common/enums';

export class PatientInfoDto {
  @ApiPropertyOptional({ description: 'Patient name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Patient age' })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ description: 'Patient gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Patient condition' })
  @IsOptional()
  @IsString()
  condition?: string;
}

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

export class CreateEmergencyDto {
  @ApiProperty({ description: 'Caller name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  callerName: string;

  @ApiProperty({ description: 'Caller phone number', example: '+66812345678' })
  @IsString()
  @IsNotEmpty()
  callerPhone: string;

  @ApiProperty({ description: 'Emergency description', example: 'Car accident with injuries' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: EmergencySeverity, description: 'Emergency severity level' })
  @IsEnum(EmergencySeverity)
  severity: EmergencySeverity;

  @ApiProperty({ description: 'Emergency address', example: '123 Main Street, Bangkok' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: LocationDto, description: 'GPS coordinates' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({ description: 'Number of patients', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  patientCount?: number;

  @ApiPropertyOptional({ type: [PatientInfoDto], description: 'Patient information' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientInfoDto)
  patients?: PatientInfoDto[];

  @ApiPropertyOptional({ description: 'Emergency type/category', example: 'Traffic Accident' })
  @IsOptional()
  @IsString()
  emergencyType?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

