import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class FacebookAuthDto {
  @ApiProperty({
    description: 'Facebook OAuth access token',
    example: 'EAABsbCS1iHgBAKZ...'
  })
  @IsString()
  token: string;

  @ApiPropertyOptional({
    description: 'Optional organization ID to associate with the user',
  })
  @IsMongoId()
  @IsOptional()
  organizationId?: string;
}

