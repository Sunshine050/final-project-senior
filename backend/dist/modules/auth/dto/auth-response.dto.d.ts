import { Role } from '../../../common/enums';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
    organizationId?: string;
    avatar?: string;
    isActive: boolean;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: UserResponseDto;
}
export declare class ProfileResponseDto extends UserResponseDto {
    isEmailVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
}
