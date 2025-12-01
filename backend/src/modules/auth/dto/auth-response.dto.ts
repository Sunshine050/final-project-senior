import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../common/enums';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiPropertyOptional({ description: 'User phone' })
  phone?: string;

  @ApiProperty({ enum: Role, description: 'User role' })
  role: Role;

  @ApiPropertyOptional({ description: 'Organization ID' })
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  avatar?: string;

  @ApiProperty({ description: 'Account active status' })
  isActive: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ type: UserResponseDto, description: 'User information' })
  user: UserResponseDto;
}

export class ProfileResponseDto extends UserResponseDto {
  @ApiProperty({ description: 'Email verification status' })
  isEmailVerified: boolean;

  @ApiPropertyOptional({ description: 'Last login timestamp' })
  lastLogin?: Date;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;
}

