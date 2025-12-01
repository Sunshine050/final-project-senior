import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google OAuth access token or ID token' })
  @IsString()
  token: string;

  @ApiPropertyOptional({ description: 'Organization ID to associate with the user' })
  @IsOptional()
  @IsMongoId()
  organizationId?: string;
}

