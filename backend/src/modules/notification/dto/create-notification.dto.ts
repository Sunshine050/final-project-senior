import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsObject,
  IsDateString,
} from 'class-validator';
import { NotificationType } from '../../../schemas/notification.schema';

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Additional data' })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Target user ID' })
  @IsOptional()
  @IsMongoId()
  targetUserId?: string;

  @ApiPropertyOptional({ description: 'Target organization ID' })
  @IsOptional()
  @IsMongoId()
  targetOrganizationId?: string;

  @ApiPropertyOptional({ description: 'Target role' })
  @IsOptional()
  @IsString()
  targetRole?: string;

  @ApiPropertyOptional({ description: 'Related emergency ID' })
  @IsOptional()
  @IsMongoId()
  emergencyId?: string;

  @ApiPropertyOptional({ description: 'Priority level (1-5)', default: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

